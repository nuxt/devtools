<script setup lang='ts'>
const show = ref(false)
const icon = ref<string | undefined>()
const text = ref<string | undefined>()

provideNotification((_text, _icon, duration = 1500) => {
  text.value = _text
  icon.value = _icon
  show.value = true
  setTimeout(() => {
    show.value = false
  }, duration)
})
</script>

<template>
  <div

    fixed left-0 right-0 top-0 z-50 text-center
    :class="show ? '' : 'pointer-events-none overflow-hidden'"
  >
    <div
      border="~ base"
      flex="~ inline gap2"
      m-3 inline-block items-center rounded px-4 py-1 text-primary transition-all duration-300 bg-base
      :style="show ? {} : { transform: 'translateY(-300%)' }"
      :class="show ? 'shadow' : 'shadow-none'"
    >
      <div v-if="icon" :class="icon" />
      <div>{{ text }}</div>
    </div>
  </div>
</template>
