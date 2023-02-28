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

    text-center top-0 right-0 left-0 fixed z-50
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
