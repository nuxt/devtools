import type { NuxtDevtoolsServerContext } from '../types'

export async function setup({ nuxt }: NuxtDevtoolsServerContext) {
  if (!nuxt.options.dev)
    return

  /**
   * Wrap plugins with performance metrics
   */
  nuxt.hook('app:templates', (app) => {
    app.templates.filter(i => i.filename?.startsWith('plugins/'))
      .forEach((i) => {
        if (!i.getContents)
          return
        const original = i.getContents
        i.getContents = async (...args) => {
          let content = await original(...args)

          const PAYLOAD_KEY = '__NUXT_DEVTOOLS_PLUGINS_METRIC__'
          const WRAPPER_KEY = '__DEVTOOLS_WRAPPER__'
          if (content.includes(PAYLOAD_KEY))
            return content

          const snippets = `
globalThis.${PAYLOAD_KEY} = []
function ${WRAPPER_KEY} (plugin, src) {
  if (!plugin)
    return plugin
  
  return defineNuxtPlugin(async (...args) => {
    const start = performance.now()
    const result = await plugin(...args)
    const end = performance.now()
    globalThis.${PAYLOAD_KEY}.push({
      src,
      duration: end - start,
    })
    return result
  })
}
`

          const imports = Array.from(content.matchAll(/(?:\n|^)import (.*) from ['"](.*)['"]/g))
            .map(([, name, path]) => ({ name, path }))

          content = content.replace(/\nexport default\s*\[([\s\S]*)\]/, (_, itemsRaw: string) => {
            const items = itemsRaw.split(',').map(i => i.trim())
              .map((i) => {
                const importItem = imports.find(({ name }) => name === i)
                if (!importItem)
                  return i
                return `${WRAPPER_KEY}(${i}, ${JSON.stringify(importItem.path)})`
              })
            return `\n${snippets}\nexport default [\n${items.join(',\n')}\n]\n`
          })

          return content
        }
      })
  })
}
