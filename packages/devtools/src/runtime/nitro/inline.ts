import type { NitroAppPlugin } from 'nitropack'

// @ts-expect-error injected
import { script } from '#nuxt-devtools-inline'

export default <NitroAppPlugin> function (nitro) {
  // @ts-expect-error missing type
  nitro.hooks.hook('render:html', (htmlContext) => {
    // @ts-expect-error missing type
    htmlContext.head.push(`<script>${script}</script>`)
  })
}
