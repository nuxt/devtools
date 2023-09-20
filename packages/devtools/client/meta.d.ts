import type { MaybeRefOrGetter } from 'vue'
import type { TabCategory } from '../src/types'

declare module '#app' {
  interface PageMeta {
    icon?: string
    title?: string
    order?: number
    category?: TabCategory
    show?: () => any
    badge?: () => MaybeRefOrGetter<string | number | undefined>
  }
}

export {}
