<script setup lang='ts'>
let show = $ref(false)
let icon = $ref<string | undefined>()
let text = $ref<string | undefined>()

provideNotification((_text, _icon, duration = 1500) => {
  text = _text
  icon = _icon
  show = true
  setTimeout(() => {
    show = false
  }, duration)
})
</script>

<template>
  <div
    fixed
    top-0
    left-0
    right-0
    z-50
    text-center
    :class="show ? '' : 'pointer-events-none overflow-hidden'"
  >
    <div
      px-4
      py-1
      rounded
      bg-base
      inline-block
      m-3
      transition-all
      duration-300
      text-primary
      border="~ base"
      flex="~ inline gap2"
      items-center
      :style="show ? {} : { transform: 'translateY(-300%)' }"
      :class="show ? 'shadow' : 'shadow-none'"
    >
      <div v-if="icon" :class="icon" />
      <div>{{ text }}</div>
    </div>
  </div>
</template>
