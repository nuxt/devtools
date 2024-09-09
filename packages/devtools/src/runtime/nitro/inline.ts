// @ts-expect-error injected
import { script } from '#nuxt-devtools-inline'

import type { NitroAppPlugin } from 'nitropack'

export default <NitroAppPlugin> function (nitro) {
  nitro.hooks.hook('render:html', (htmlContext) => {
    htmlContext.head.push(`<script>${script}</script>`)
  })
}
