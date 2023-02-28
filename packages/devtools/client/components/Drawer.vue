<script setup lang="ts">
const client = useClient()
const tabs = useTabs()
</script>

<template>
  <div border="r base" flex="~ col" h-full>
    <div flex="~" p2 items-center border="b base">
      <VDropdown placement="left-start" :distance="20" hidden lg:block>
        <NuxtLogo
          h-8
          :class="client ? '' : 'saturate-0'"
          :title="client ? 'Nuxt DevTools' : 'DevTools Client not connected, try open it in iframe mode'"
        />
        <template #popper>
          <DockingPanel />
        </template>
      </VDropdown>

      <div hidden lg:block flex-auto />

      <NDarkToggle v-slot="{ toggle }">
        <button n-icon-btn w-7 mr--1 h-7 class="hidden! lg:block!" @click="toggle()">
          <div carbon-sun dark:carbon-moon translate-y--1px />
        </button>
      </NDarkToggle>
      <button v-if="client" n-icon-btn w-7 h-7 @click="client.closeDevTools()">
        <div i-carbon-close scale-140 />
      </button>
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
        px4 hidden py2 justify-center lg:flex gap3 text-yellow5
      >
        Server data only
      </div>
    </template>
  </div>
</template>
