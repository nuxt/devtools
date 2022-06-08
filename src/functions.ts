import { existsSync } from 'fs'
import type { Component, Nuxt } from '@nuxt/schema'
import { resolvePreset } from 'unimport'
import type { Import } from 'unimport'
import type { ServerFunctions } from './types'

export function createServerFunctions(nuxt: Nuxt) {
  let components: Component[] = []
  let imports: Import[] = []
  let importPresets: Import[] = []

  nuxt.hook('components:extend', (c) => {
    components = c as Component[]
  })
  nuxt.hook('autoImports:extend', (c) => {
    imports = c
  })
  nuxt.hook('autoImports:sources', (c) => {
    importPresets = c.flatMap(i => resolvePreset(i))
  })

  const serverFunctions: ServerFunctions = {
    getConfig() {
      return nuxt.options
    },
    getComponents() {
      return components
    },
    getAutoImports() {
      return [
        ...imports,
        ...importPresets,
      ]
    },
    async openInEditor(filepath: string) {
      const file = [
        filepath,
`${filepath}.js`,
`${filepath}.mjs`,
`${filepath}.ts`,
      ].find(i => existsSync(i))
      if (file)
        import('launch-editor').then(r => r(file))
    },
  }

  return serverFunctions
}
