<script setup lang="ts">
const client = useClient()
const tabs = useTabs()
</script>

<template>
  <div border="r base" flex="~ col" h-full>
    <div flex="~ gap1" pl3 pr2 items-center py2 border="b base">
      <VDropdown placement="left-start" :distance="20">
        <NuxtLogo
          h-8 hidden lg:block
          :class="client ? '' : 'saturate-0'"
          :title="client ? 'Nuxt DevTools' : 'DevTools Client not connected, try open it in iframe mode'"
        />
        <template #popper>
          <Settings />
        </template>
      </VDropdown>

      <div hidden lg:block flex-auto />
      <NDarkToggle v-slot="{ toggle }">
        <button text-sm op50 hover:op100 carbon-sun dark:carbon-moon class="hidden! lg:block!" @click="toggle()" />
      </NDarkToggle>
      <button v-if="client" op50 hover:op100 carbon-close text-xl ma @click="client.closeDevTools()" />
    </div>

    <DrawerItem
      v-for="tab of tabs.builtin.value"
      :key="tab.name"
      :tab="tab"
    />
    <template v-if="tabs.custom.value.length">
      <div text-xs p1 lg:p2 text-hex-888 text-center uppercase tracking-widest border="b base">
        <span hidden lg:inline>Modules</span>
      </div>
      <DrawerItem
        v-for="tab of tabs.custom.value"
        :key="tab.name"
        :tab="tab"
      />
      <div flex-auto />
      <div
        v-if="showConnectionWarning"
        px4 hidden theme-banner-yellow justify-center lg:flex gap3
      >
        Server data only
      </div>
    </template>
  </div>
</template>
