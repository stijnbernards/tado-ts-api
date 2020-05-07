import fetchTadoEnv from './fetchTadoEnv'
import fetch from 'node-fetch'
import {URLSearchParams} from "url";

export interface TadoOAuth {
  clientApiEndpoint: string
  apiEndpoint: string
  // I think this never changes
  clientId: 'tado-web-app'
  clientSecret: string
}

export interface TadoAccessToken {
  access_token: string
  token_type: string
  refresh_token: string
  expires_in: number
  scope: string
  jti: string
}

declare global {
  let tadoAccessToken: TadoAccessToken
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NodeJS {
    interface Global {
      // This needs to be a Promise so it isn't possible to create multiple
      // async fetch calls to the Tado env file.
      tadoAccessToken: Promise<TadoAccessToken> | undefined
    }
  }
}

async function generateToken() {
  if (global.tadoAccessToken) {
    return global.tadoAccessToken
  }

  global.tadoAccessToken = new Promise((resolve) => {
    fetchTadoEnv().then((tadoEnvironment) => {
      /* eslint-disable @typescript-eslint/camelcase */
      const oauthBody = {
        client_id: tadoEnvironment.oauth.clientId,
        client_secret: tadoEnvironment.oauth.clientSecret,
        grant_type: 'password',
        password: process.env.TADO_PASSWORD,
        scope: 'home.user',
        username: process.env.TADO_USERNAME,
      }
      /* eslint-enable @typescript-eslint/camelcase */

      fetch(`${tadoEnvironment.oauth.apiEndpoint}/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams(oauthBody).toString(),
      }).then((authResponse) => {
        if (authResponse.ok) {
          resolve(authResponse.json())
          return
        }

        authResponse.text().then((result) => {throw Error(result)})
      })
    })
  })

  return global.tadoAccessToken
}

async function refreshToken() {
  // get the access token before we reset it
  const accessToken = await global.tadoAccessToken

  global.tadoAccessToken = new Promise((resolve) => {
    fetchTadoEnv().then((tadoEnvironment) => {
      // Not sure how this would ever occur, but if no access token exists regenerate and return it
      if (!accessToken) {
        resolve(generateToken())
        return
      }

      /* eslint-disable @typescript-eslint/camelcase */
      const oauthBody = {
        client_id: tadoEnvironment.oauth.clientId,
        client_secret: tadoEnvironment.oauth.clientSecret,
        refresh_token: accessToken.refresh_token,
        grant_type: 'refresh_token',
        scope: 'home.user',
      }
      /* eslint-enable @typescript-eslint/camelcase */

      fetch(`${tadoEnvironment.oauth.apiEndpoint}/token`, {
        method: 'POST',
        body: new URLSearchParams(oauthBody),
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
      }).then((response) => {
       response.json().then((newToken) => {
         resolve(newToken)
        })
      })
    })
  })
}

export { refreshToken, generateToken }
