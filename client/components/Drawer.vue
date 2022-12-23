<script setup lang="ts">
</script>

<template>
  <div border="l base" flex="~ col" h-full>
    <div pl3 pr2 py2 flex="~ gap1" items-center>
      <NuxtLogo w-7 h-7 />
      <div text-lg font-bold>
        DevTools
      </div>
      <div flex-auto />
      <NDarkToggle v-slot="{ toggle }">
        <button carbon-sun dark:carbon-moon @click="toggle()" />
      </NDarkToggle>
      <button carbon-close text-xl op50 hover:op100 ma />
    </div>
    <div p2 text-hex-888 text-xs text-center uppercase tracking-widest border="t b base">
      Builtin
    </div>
    <DrawerItem
      v-for="tab of tabsInfoBuiltin"
      :key="tab.name"
      :tab="tab"
    />
    <div p2 text-hex-888 text-xs text-center uppercase tracking-widest border="b base">
      Modules
    </div>
    <DrawerItem
      v-for="tab of tabsInfoCustom"
      :key="tab.name"
      :tab="tab"
    />
    <div flex-auto />
  </div>
</template>
