import type { Ref } from 'vue'
import { computed, ref } from 'vue'

export type ColorScheme = 'dark' | 'light'

export function useClientColorMode(): Ref<ColorScheme> {
  const explicitColor = ref<ColorScheme>()
  const systemColor = ref<ColorScheme>()

  const elements = [
    document.documentElement,
    document.body,
  ]

  const ob = new MutationObserver(getExplicitColor)

  elements.forEach((el) => {
    ob.observe(el, {
      attributes: true,
      attributeFilter: ['class'],
    })
  })

  const preferDarkQuery = window.matchMedia('(prefers-color-scheme: dark)')
  const preferLightQuery = window.matchMedia('(prefers-color-scheme: light)')
  preferDarkQuery.addEventListener('change', getSystemColor)
  preferLightQuery.addEventListener('change', getSystemColor)

  function getExplicitColor() {
    let color: ColorScheme | undefined

    for (const el of elements) {
      if (el.classList.contains('dark')) {
        color = 'dark'
        break
      }
      if (el.classList.contains('light')) {
        color = 'light'
        break
      }
    }

    explicitColor.value = color
  }

  function getSystemColor() {
    if (preferDarkQuery.matches)
      systemColor.value = 'dark'
    else if (preferLightQuery.matches)
      systemColor.value = 'light'
    else
      systemColor.value = undefined
  }

  getExplicitColor()
  getSystemColor()

  return computed(() => explicitColor.value || systemColor.value || 'light')
}
