import { parseModule } from 'magicast'
import { getDefaultExportOptions } from 'magicast/helpers'

/**
 * Return `source` with `name` removed from the Nuxt config `modules` array.
 * Handles both string entries (`'@nuxt/image'`) and tuple entries
 * (`['@nuxt/image', {...}]`). If the module isn't present, returns the code
 * unchanged.
 */
export function removeNuxtModuleFromCode(source: string, name: string, filepath?: string): string {
  const mod = parseModule(source, filepath ? { sourceFileName: filepath } : undefined)
  const config = getDefaultExportOptions(mod)
  if (!Array.isArray(config.modules))
    return mod.generate().code

  config.modules = config.modules.filter((entry: unknown) => {
    if (typeof entry === 'string')
      return entry !== name
    if (Array.isArray(entry))
      return entry[0] !== name
    return true
  })

  return mod.generate().code
}
