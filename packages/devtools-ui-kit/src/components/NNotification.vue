<script setup lang='ts'>
import { ref } from 'vue'

import { devtoolsUiProvideNotificationFn } from '../composables/notification'
import type { DevtoolsUiShowNotificationPosition } from '../composables/notification'

const show = ref(false)
const icon = ref<string>()
const text = ref<string>()
const classes = ref<string>()
const position = ref<DevtoolsUiShowNotificationPosition>('top-center')

devtoolsUiProvideNotificationFn((data) => {
  text.value = data.message
  icon.value = data.icon
  classes.value = data.classes ?? 'text-primary border-primary'
  icon.value = data.icon
  show.value = true
  position.value = data.position ?? 'top-center'
  setTimeout(() => {
    show.value = false
  }, data.duration ?? 1500)
})
</script>

<template>
  <div
    fixed left-0 right-0 z-999 text-center
    :class="[
      { 'pointer-events-none overflow-hidden': !show },
      { 'top-0': position.startsWith('top') },
      { 'bottom-0': position.startsWith('bottom') },
    ]"
  >
    <div flex :style="{ justifyContent: position.includes('right') ? 'right' : position.includes('left') ? 'left' : 'center' }">
      <div
        border="~ base"
        flex="~ inline gap2"
        m-3 inline-block items-center rounded px-4 py-1 transition-all duration-300 bg-base
        :style="show ? {} : { transform: `translateY(${position.startsWith('top') ? '-' : ''}300%)` }"
        :class="[show ? 'shadow' : 'shadow-none', classes]"
      >
        <div v-if="icon" :class="icon" />
        <div>{{ text }}</div>
      </div>
    </div>
  </div>
</template>
