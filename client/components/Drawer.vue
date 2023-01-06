<script setup lang="ts">
const customTabs = $computed(() => tabsInfoIframe.filter(i => !i.builtin))
const builtinIframeTabs = $computed(() => tabsInfoIframe.filter(i => i.builtin))

const client = useClient()
</script>

<template>
  <div border="l base" flex="~ col" h-full>
    <div pl3 pr2 py2 flex="~ gap1" items-center border="b base">
      <NuxtLogo h-8 />
      <div flex-auto />
      <NDarkToggle v-slot="{ toggle }">
        <button carbon-sun text-sm op50 hover:op100 dark:carbon-moon @click="toggle()" />
      </NDarkToggle>
      <button carbon-close text-xl op50 hover:op100 ma />
    </div>

    <DrawerItem
      v-for="tab of [...tabsInfoBuiltin, ...builtinIframeTabs]"
      :key="tab.name"
      :tab="tab"
    />
    <template v-if="customTabs.length">
      <div p2 text-hex-888 text-xs text-center uppercase tracking-widest border="b base">
        By Modules
      </div>
      <DrawerItem
        v-for="tab of customTabs"
        :key="tab.name"
        :tab="tab"
      />
      <div flex-auto />
    </template>
    <div v-if="!client" text-sm p4 bg-orange:10 text-orange>
      Not connected to the client, showing server-side data only. Use the embedded mode for full features.
    </div>
  </div>
</template>
