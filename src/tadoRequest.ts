import fetch, { RequestInit } from 'node-fetch'
import { generateToken, refreshToken } from './tadoOAuth'
import fetchTadoEnv from './fetchTadoEnv'

export default async function tadoRequest<T = any>(uri: string, options: RequestInit = {}, attempts: number = 0) {
  if (attempts > 2) {
    throw Error('💥 Could not acquire access token!')
  }

  const tadoEnvironment = await fetchTadoEnv()
  const tokenData = await generateToken()

  const requestOptions = {
    ...options,
    headers: {
      Authorization: `Bearer ${tokenData.access_token}`,
    }
  }

  if (options.headers) {
    requestOptions.headers = {
      ...requestOptions.headers,
      ...options.headers
    }
  }

  return new Promise<T>((resolve) => {
    try {
      fetch(`${tadoEnvironment.baseUrl}${uri}`, requestOptions).then((response) => {
        if (response.status === 401) {
          refreshToken().then(() => {
            resolve(tadoRequest(uri, options, attempts += 1))
          })

          return
        }

        response.json().then((result => {
          resolve(result)
        }))
      })
    } catch (error) {
      console.warn(error)
    }
  })
}
