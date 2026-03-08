// @ts-expect-error injected
import { script } from '#nuxt-devtools-inline'

export default function (nitroApp: { hooks: { hook: (name: string, fn: (...args: any[]) => void) => void } }) {
  nitroApp.hooks.hook('render:html', (htmlContext: { head: string[] }) => {
    htmlContext.head.push(`<script>${script}</script>`)
  })
}
