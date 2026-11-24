import { defineNuxtPlugin } from '#imports'
import { setIconifySvgLoader } from '../../../devtools-ui-kit/src/composables/iconify'
import { rpc } from '../composables/rpc'

// Resolve icons from the dev server's local Iconify collections instead of a
// CDN, so DevTools works offline and under strict CSP (#917).
export default defineNuxtPlugin(() => {
  setIconifySvgLoader((collection, name) => rpc.getIconSvg(collection, name))
})
