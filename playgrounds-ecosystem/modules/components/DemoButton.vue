<script setup lang="ts">
// @compodium/nuxt — a component playground. Compodium scans the app's
// `components/` directory, so this single component is enough to give its
// DevTools "Compodium" tab a real, prop-driven component to preview and
// tweak in isolation.
withDefaults(defineProps<{
  /** Text shown inside the button. */
  label?: string
  /** Visual emphasis. */
  variant?: 'primary' | 'secondary'
}>(), {
  label: 'Click me',
  variant: 'primary',
})
</script>

<template>
  <button type="button" :class="['demo-button', `demo-button--${variant}`]">
    {{ label }}
  </button>
</template>

<style scoped>
.demo-button {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.375rem;
  font: inherit;
  cursor: pointer;
}

.demo-button--primary {
  background: #00dc82;
  color: #0b1e13;
}

.demo-button--secondary {
  background: #1a1a2e;
  color: #fff;
}
</style>
