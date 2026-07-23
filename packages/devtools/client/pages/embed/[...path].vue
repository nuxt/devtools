<script setup lang="ts">
import { onMounted } from 'vue'
import { useRoute, useRouter } from '#app/composables/router'
import { definePageMeta } from '#imports'
import { markEmbedded } from '~/composables/embed'

definePageMeta({
  layout: 'none',
})

const route = useRoute()
const router = useRouter()

// Mark this iframe as an embedded single-tab view, then redirect to the real
// tab route. The shell (SideNav + split pane) stays hidden while embedded.
markEmbedded()

const segments = route.params.path
const target = `/${(Array.isArray(segments) ? segments : [segments]).filter(Boolean).join('/')}`

onMounted(() => {
  router.replace(target === '/' ? '/modules/overview' : target)
})
</script>

<template>
  <div h-screen w-screen bg-base />
</template>
