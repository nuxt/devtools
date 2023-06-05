<script setup lang='ts'>
const show = ref(false)
const icon = ref<string | undefined>()
const text = ref<string | undefined>()
const classes = ref<string | undefined>()

provideNotificationFn((data) => {
  text.value = data.message
  icon.value = data.icon
  classes.value = data.classes ?? 'text-primary'
  show.value = true
  setTimeout(() => {
    show.value = false
  }, data.duration ?? 1500)
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
      m-3 inline-block items-center rounded px-4 py-1 transition-all duration-300 bg-base
      :style="show ? {} : { transform: 'translateY(-300%)' }"
      :class="[show ? 'shadow' : 'shadow-none', classes]"
    >
      <div v-if="icon" :class="icon" />
      <div>{{ text }}</div>
    </div>
  </div>
</template>
