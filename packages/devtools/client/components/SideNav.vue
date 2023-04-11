<script setup lang="ts">
const client = useClient()
const tabs = useTabs()
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

      <div mt-2 h-1px w-8 border="b base" />
    </div>

    <SideNavItem
      v-for="tab of tabs.builtin.value"
      :key="tab.name"
      :tab="tab"
    />
    <template v-if="tabs.custom.value.length">
      <div my1 h-1px w-8 border="b base" />
      <SideNavItem
        v-for="tab of tabs.custom.value"
        :key="tab.name"
        :tab="tab"
      />
      <div flex-auto />
    </template>
  </div>
</template>
