import { logger } from '@nuxt/kit'

export async function magicastGuard(fn: (() => Promise<string>), message = '') {
  let generated: string | undefined

  try {
    generated = await fn()
  }
  catch (e) {
    logger.error(e)
    throw new Error(`Magicast failed to modify Nuxt config automatically. Maybe the config are composed too dynamically that we failed to statically analyze it. ${message}`)
  }

  return generated
}
