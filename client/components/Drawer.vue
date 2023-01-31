<script setup lang="ts">
const client = useClient()
const tabs = useTabs()
</script>

<template>
  <div border="l base" flex="~ col" h-full>
    <div pl3 pr2 py2 flex="~ gap1" items-center border="b base">
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

      <div flex-auto hidden lg:block />
      <NDarkToggle v-slot="{ toggle }">
        <button carbon-sun text-sm op50 hover:op100 dark:carbon-moon class="hidden! lg:block!" @click="toggle()" />
      </NDarkToggle>
      <button carbon-close text-xl op50 hover:op100 ma />
    </div>

    <DrawerItem
      v-for="tab of tabs.builtin.value"
      :key="tab.name"
      :tab="tab"
    />
    <template v-if="tabs.custom.value.length && devToolsSettings.customTabs">
      <div p1 lg:p2 text-hex-888 text-xs text-center uppercase tracking-widest border="b base">
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
        px4 theme-banner-yellow justify-center hidden lg:flex gap3
      >
        Server data only
      </div>
    </template>
  </div>
</template>
