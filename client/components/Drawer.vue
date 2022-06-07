<script setup lang="ts">
const router = useRouter()
const routes = router.getRoutes()
const modules = routes
  .filter(route => route.path.startsWith('/modules/'))
  .sort((a, b) => (a.meta.order || 0) - (b.meta.order || 0))
</script>

<template>
  <div border="r base">
    <NuxtLink
      v-for="m of modules" :key="m.name" :to="m.path"
      flex items-center gap2 px3 py2 text-true-gray
      border="b base"
      hover="bg-gray/5"
      active-class="!text-primary"
    >
      <div :class="m.meta.icon" />
      <div>{{ m.meta.display }}</div>
    </NuxtLink>
  </div>
</template>
