import type { NitroAppPlugin } from 'nitropack'

// @ts-expect-error injected
import { script } from '#nuxt-devtools-inline'

export default <NitroAppPlugin> function (nitro) {
  // `render:html` is still called at runtime regardless of Nitro engine (it's
  // part of Nuxt's own render handler, layered atop Nitro v2/v3 alike) but
  // `@nuxt/nitro-server-nightly`'s type augmentations currently only target
  // Nitro v3's `nitro/types` module, leaving `nitropack`'s `NitroRuntimeHooks`
  // (used here) without it. Suppress until the nightly restores that augmentation.
  // @ts-expect-error see comment above
  nitro.hooks.hook('render:html', (htmlContext) => {
    htmlContext.head.push(`<script>${script}</script>`)
  })
}
