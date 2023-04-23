<script setup lang="ts">
const client = useClient()
const categories = useCategorizedTabs()
</script>

<template>
  <div border="r base" flex="~ col gap-0.5" z-100 h-full items-center bg-base class="no-scrollbar">
    <div flex="~ col" sticky top-0 z-1 mb1 items-center pt3 bg-base>
      <VDropdown placement="left-start" :distance="20">
        <button
          i-logos-nuxt-icon h-6 w-6 text-lg
          :class="client ? '' : 'saturate-0'"
          :title="client ? 'Nuxt DevTools' : 'DevTools Client not connected, try open it in iframe mode'"
        />
        <template #popper>
          <DockingPanel />
        </template>
      </VDropdown>
    </div>

    <template v-for="[name, tabs] of categories" :key="name">
      <template v-if="tabs.length">
        <div my1 h-1px w-8 border="b base" />

        <SideNavItem
          v-for="tab of tabs"
          :key="tab.name"
          :tab="tab"
        />
      </template>
    </template>

    <div flex-auto />
  </div>
</template>
