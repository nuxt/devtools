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

    text-center fixed top-0 left-0 right-0 z-50
    :class="show ? '' : 'pointer-events-none overflow-hidden'"
  >
    <div

      border="~ base"
      flex="~ inline gap2"
      rounded bg-base text-primary items-center px-4 py-1 inline-block m-3 transition-all duration-300
      :style="show ? {} : { transform: 'translateY(-300%)' }"
      :class="show ? 'shadow' : 'shadow-none'"
    >
      <div v-if="icon" :class="icon" />
      <div>{{ text }}</div>
    </div>
  </div>
</template>
