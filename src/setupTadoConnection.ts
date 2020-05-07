import { generateToken } from './tadoOAuth'

/**
 * This generates a token and fetches the .env file.
 * There is no requirement to actually call this function, but it might be useful for a initialization function
 */
export async function setupTadoConnection() {
  await generateToken()
  console.log(`🌡️  Tado connection established`)
}
