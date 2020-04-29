import fetch, { RequestInit } from 'node-fetch'
import { generateToken, refreshToken } from '~/tadoOAuth'
import fetchTadoEnv from '~/fetchTadoEnv'

export default async function tadoRequest(uri: string, options: RequestInit) {
  const tadoEnvironment = await fetchTadoEnv()
  const tokenData = await generateToken()

  return new Promise((resolve) => {
    fetch(`${tadoEnvironment.baseUrl}${uri}`, {
      ...options,
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
        ...options.headers,
      },
    }).then((response) => {
      if (response.status === 401) {
        refreshToken().then(() => {
          resolve(tadoRequest(uri, options))
        })

        return
      }

      resolve(response)
    })
  })
}
