import { TadoOAuth } from './tadoOAuth'
import nodeEval from 'node-eval'

import fetch from 'node-fetch'
import { createHash } from 'crypto'

export class IntegrityError extends Error {}
export class EnvFileError extends Error {}

export interface TadoEnvironment {
  version: string
  environment: 'production' | 'development'
  debugEnabled: boolean
  logEndpoint: string
  baseUrl: string
  tgaRestApiEndpoint: string
  tgaRestApiV2Endpoint: string
  susiApiEndpoint: string
  supportRestApiEndpoint: string
  homeBackendBaseUrl: string
  hvacApiEndpoint: string
  hvacIncludeInstallFlowsUnderDevelopment: boolean
  customerSupportBaseUrl: string
  genieRestApiEndpoint: string
  ivarRestApiEndpoint: string
  gaTrackingId: string
  unknownModelImagesS3Bucket: string
  oauth: TadoOAuth
}

declare global {
  let TadoEnvironment: TadoEnvironment
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NodeJS {
    interface Global {
      // This needs to be a Promise so it isn't possible to create multiple
      // async fetch calls to the Tado env file.
      tadoEnvironment: Promise<TadoEnvironment> | undefined
    }
  }
}

async function fetchTadoEnv() {
  if (global.tadoEnvironment) {
    return global.tadoEnvironment
  }

  global.tadoEnvironment = new Promise((resolve) => {
    fetch(process.env.TADO_ENV || 'https://my.tado.com/webapp/env.js')
      .then((envFile) => envFile.text())
      .then((envData) => {
        const integrity = createHash('sha256')
          .update(envData, 'utf8')
          .digest('base64')

        if (
          integrity !== process.env.TADO_ENV_INTEGRITY &&
          process.env.TADO_ENV_INTEGRITY_CHECK
        ) {
          throw new IntegrityError(
            `💥 Integrity check failed! Did the Tado ENV update? Received following sha256 integrity: ${integrity}`,
          )
        }

          console.log(`🌡️  Tado Env integrity hash: ${integrity}`)

        // The environment file is a JS file so we execute it to get the data
        const TD = nodeEval(envData + ';module.exports = TD')

        if (TD === undefined) {
          throw new EnvFileError(
            `💥 Something went wrong during Tado env file loading.`,
          )
        }

        resolve(TD.config)
      })
  })

  return global.tadoEnvironment
}

export default fetchTadoEnv
