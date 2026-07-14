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

  // Splice matching entries out in place (reverse order so indices stay
  // valid as we remove) rather than reassigning a filtered array — magicast
  // regenerates a reassigned array from scratch and drops the surrounding
  // formatting/comments of the entries that remain.
  for (let i = config.modules.length - 1; i >= 0; i--) {
    const entry = config.modules[i]
    const matches = typeof entry === 'string'
      ? entry === name
      : Array.isArray(entry) && entry[0] === name
    if (matches)
      config.modules.splice(i, 1)
  }

  return mod.generate().code
}
