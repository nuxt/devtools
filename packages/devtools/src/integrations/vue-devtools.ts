import { addVitePlugin } from '@nuxt/kit'
import { join } from 'pathe'
import { runtimeDir } from '../dirs'
import type { NuxtDevtoolsServerContext } from '../types'

export function setup({ nuxt }: NuxtDevtoolsServerContext) {
  if (!nuxt.options.dev || nuxt.options.test)
    return

  addVitePlugin({
    name: 'vue:devtools',
    async resolveId(importee: string) {
      if (importee.startsWith('virtual:vue-devtools-path:')) {
        const resolved = importee.replace('virtual:vue-devtools-path:', join(runtimeDir, 'vue-devtools/'))
        return resolved
      }
    },
    transform(code, id, options) {
      const [filename] = id.split('?', 2)
      const appendTo = /\/entry\.m?js$/

      if (!options?.ssr && appendTo.test(filename))
        code = `import 'virtual:vue-devtools-path:overlay.js';\n${code}`

      return code
    },
  })
}
