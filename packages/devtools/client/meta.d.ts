import { TabCategory } from "../src/types"

declare module '#app' {
  interface PageMeta {
    icon?: string
    title?: string
    order?: number
    category?: TabCategory
    show?: () => any
    badge?: () => string | number | undefined
  }
}

export {}
