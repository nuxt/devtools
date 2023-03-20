<script setup lang="ts">
const client = useClient()
const tabs = useTabs()
</script>

<template>
  <div border="r base" flex="~ col gap-0.5" h-full items-center bg-base z-100 class="no-scrollbar">
    <div flex="~ col" items-center bg-base top-0 pt3 sticky z-1 mb1>
      <VDropdown placement="left-start" :distance="20">
        <button

          text-lg w-6 h-6 i-logos-nuxt-icon
          :class="client ? '' : 'saturate-0'"
          :title="client ? 'Nuxt DevTools' : 'DevTools Client not connected, try open it in iframe mode'"
        />
        <template #popper>
          <DockingPanel />
        </template>
      </VDropdown>

      <div h-1px w-8 mt-2 border="b base" />
    </div>

    <SideNavItem
      v-for="tab of tabs.builtin.value"
      :key="tab.name"
      :tab="tab"
    />
    <template v-if="tabs.custom.value.length">
      <div h-1px w-8 my1 border="b base" />
      <SideNavItem
        v-for="tab of tabs.custom.value"
        :key="tab.name"
        :tab="tab"
      />
      <div flex-auto />
    </template>
  </div>
</template>
