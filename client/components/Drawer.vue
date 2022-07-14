<script setup lang="ts">
const tabs = await getTabs()
</script>

<template>
  <div border="l base" flex="~ col" h-full>
    <div pl3 pr2 py2 flex="~ gap1" items-center>
      <img src="/nuxt.png" alt="Nuxt" w-8 h-8>
      <div text-lg font-bold>
        DevTools
      </div>
      <div flex-auto />
      <NDarkToggle v-slot="{ toggle }">
        <button carbon-sun dark:carbon-moon @click="toggle()" />
      </NDarkToggle>
      <button carbon-close text-xl op50 hover:op100 ma />
    </div>
    <NuxtLink
      v-for="m of tabs"
      :key="m.name"
      :to="m.path"
      flex
      items-center
      gap2
      px3
      py2
      text-true-gray
      border="b base"
      hover="bg-gray/5"
      exact-active-class="!text-primary"
    >
      <img
        v-if="m.icon && (m.icon.startsWith('/') || m.icon.match(/^https?:/))"
        w6
        :src="m.icon"
        :alt="m.title"
      >
      <div
        v-else
        w6
        :class="m.icon || 'carbon-assembly-reference'"
      />
      <div>{{ m.title }}</div>
    </NuxtLink>
    <div flex-auto />
  </div>
</template>
