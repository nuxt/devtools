<script setup lang="ts">
import { ref } from 'vue'
import { useDevToolsOptions } from '../composables/storage-options'

const open = ref(false)
const { showHelpButtons } = useDevToolsOptions('ui')
</script>

<template>
  <template v-if="showHelpButtons">
    <button
      pos="absolute bottom-5 right-5"
      border="~ base rounded-full "
      flex="~ items-center justify-center"
      z-110 h-11 w-11 backdrop-blur-8
      bg="bg-base op50!" light:shadow
      hover="bg-active"
      title="Help"
      @click="open = !open"
    >
      <div i-ri:question-mark />
    </button>
    <Transition name="fade-in">
      <div
        v-if="open"
        class="fixed bottom-0 left-0 right-0 top-0 z-100"
        bg-black:20 backdrop-blur-2 @click="open = false"
      />
    </Transition>
    <Transition name="slide-in">
      <div
        v-if="open" border="l base"
        class="prose" pos="fixed bottom-0 right-0 top-0"
        z-200 h-full w-150 overflow-auto px8 py4 bg-base
      >
        <slot />
        <NButton
          icon="carbon-close"
          pos="absolute top-3 right-3"
          rounded-full text-xl
          :border="false"
          @click="open = false"
        />
      </div>
    </Transition>
  </template>
</template>

<style>
.slide-in-enter-active,
.slide-in-leave-active {
  transition: transform 0.3s;
}
.slide-in-enter-from,
.slide-in-leave-to {
  transform: translateX(100%);
}

.fade-in-enter-active,
.fade-in-leave-active {
  transition: opacity 0.3s;
}
.fade-in-enter-from,
.fade-in-leave-to {
  opacity: 0;
}
</style>
