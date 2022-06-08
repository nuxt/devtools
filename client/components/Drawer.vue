<script setup lang="ts">
const router = useRouter()
const routes = router.getRoutes()
const modules = routes
  .filter(route => route.path.startsWith('/modules/'))
  .sort((a, b) => (a.meta.order || 0) - (b.meta.order || 0))
</script>

<template>
  <div border="r base" flex="~ col" h-full>
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
    <div flex-auto />
    <div px3 py2 flex="~ gap1" items-center>
      <img src="/nuxt.png" alt="Nuxt" w-8 h-8>
      <div text-lg font-bold>
        DevTools
      </div>
      <div flex-auto />
      <NDarkToggle v-slot="{ toggle }" mx2>
        <button carbon-sun dark:carbon-moon @click="toggle()" />
      </NDarkToggle>
    </div>
  </div>
</template>
