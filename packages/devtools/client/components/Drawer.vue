<script setup lang="ts">
const client = useClient()
const tabs = useTabs()
</script>

<template>
  <div border="r base" flex="~ col gap-0.5" items-center justify-center h-full z-100 bg-base>
    <div flex="~" items-center top-0 sticky z-1 pt3 pb2>
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
    </div>

    <div h-1px my1 w-8 border="b base" />

    <DrawerItem
      v-for="tab of tabs.builtin.value"
      :key="tab.name"
      :tab="tab"
    />
    <template v-if="tabs.custom.value.length">
      <div h-1px w-8 my1 border="b base" />
      <DrawerItem
        v-for="tab of tabs.custom.value"
        :key="tab.name"
        :tab="tab"
      />
      <div flex-auto />
    </template>
  </div>
</template>
