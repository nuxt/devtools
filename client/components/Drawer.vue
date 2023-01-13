<script setup lang="ts">
const customTabs = $computed(() => tabsInfoIframe.filter(i => !i.builtin))
const builtinIframeTabs = $computed(() => tabsInfoIframe.filter(i => i.builtin))

const {
  custom,
  builtin,
} = await getTabs()

tabsInfoBuiltin.length = 0
tabsInfoIframe.length = 0
tabsInfoBuiltin.push(...builtin)
tabsInfoIframe.push(...custom)
</script>

<template>
  <div border="l base" flex="~ col" h-full>
    <div pl3 pr2 py2 flex="~ gap1" items-center border="b base">
      <NuxtLogo h-8 hidden md:block />
      <div flex-auto hidden md:block />
      <NDarkToggle v-slot="{ toggle }">
        <button carbon-sun text-sm op50 hover:op100 dark:carbon-moon class="hidden! md:block!" @click="toggle()" />
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
        <span hidden md:inline>By Modules</span>
      </div>
      <DrawerItem
        v-for="tab of customTabs"
        :key="tab.name"
        :tab="tab"
      />
      <div flex-auto />
    </template>
  </div>
</template>
