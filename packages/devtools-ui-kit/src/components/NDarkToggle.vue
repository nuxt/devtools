<script setup lang="ts">
import { useColorMode } from '@vueuse/core'

import { computed, nextTick } from 'vue'

const mode = useColorMode({
  storageKey: 'nuxt-devtools-color-mode',
})
const isDark = computed<boolean>({
  get() {
    return mode.value === 'dark'
  },
  set() {
    mode.value = isDark.value ? 'light' : 'dark'
  },
})

const isAppearanceTransition = typeof document !== 'undefined'
  && document.startViewTransition
  && !window.matchMedia('(prefers-reduced-motion: reduce)').matches

/**
 * Credit to [@hooray](https://github.com/hooray)
 * @see https://github.com/vuejs/vitepress/pull/2347
 */
function toggle(event?: MouseEvent) {
  if (!isAppearanceTransition || !event) {
    isDark.value = !isDark.value
    return
  }

  const x = event.clientX
  const y = event.clientY
  const endRadius = Math.hypot(
    Math.max(x, innerWidth - x),
    Math.max(y, innerHeight - y),
  )
  // @ts-expect-error: Transition API
  const transition = document.startViewTransition(async () => {
    isDark.value = !isDark.value
    await nextTick()
  })

  transition.ready.then(() => {
    const clipPath = [
      `circle(0px at ${x}px ${y}px)`,
      `circle(${endRadius}px at ${x}px ${y}px)`,
    ]
    document.documentElement.animate(
      {
        clipPath: isDark.value
          ? [...clipPath].reverse()
          : clipPath,
      },
      {
        duration: 400,
        easing: 'ease-in',
        pseudoElement: isDark.value
          ? '::view-transition-old(root)'
          : '::view-transition-new(root)',
      },
    )
  })
}

const context = {
  mode,
  isDark,
  toggle,
}
</script>

<template>
  <ClientOnly placeholder-tag="span">
    <slot v-bind="context" />
  </ClientOnly>
</template>
