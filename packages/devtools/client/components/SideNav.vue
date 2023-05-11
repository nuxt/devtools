<script setup lang="ts">
const client = useClient()
const categories = useCategorizedTabs()

const show = ref(false)
const panel = ref()
const button = ref<HTMLButtonElement>()

function toggle() {
  show.value = !show.value
}

onClickOutside(
  panel,
  (e) => {
    if (e.target === button.value)
      return
    show.value = false
  },
  { detectIframe: true },
)
</script>

<template>
  <div border="r base" flex="~ col" z-100 h-full items-center of-hidden bg-base>
    <div flex="~ none col items-center">
      <VDropdown
        placement="left-start"
        :distance="20"
        :triggers="[]"
        :shown="show"
        :auto-hide="true"
      >
        <button
          ref="button"
          i-logos-nuxt-icon my3 h-6 w-6 pb-2 text-lg outline-none
          :class="client ? '' : 'saturate-0'"
          :title="client ? 'Nuxt DevTools' : 'DevTools Client not connected, try open it in iframe mode'"
          @click="toggle"
        />
        <template #popper>
          <DockingPanel ref="panel" />
        </template>
      </VDropdown>
      <div h-1px w-8 border="b base" />
    </div>

    <div flex="~ auto col gap-0.5 items-center" of-auto class="no-scrollbar" py1>
      <template v-for="[name, tabs], idx of categories" :key="name">
        <template v-if="tabs.length">
          <div v-if="idx" my1 h-1px w-8 border="b base" />
          <SideNavItem
            v-for="tab of tabs"
            :key="tab.name"
            :tab="tab"
          />
        </template>
      </template>
      <div flex-auto />
    </div>

    <div flex="~ none col items-center">
      <div h-1px w-8 border="b base" />
      <NuxtLink
        to="/settings"
        flex="~ items-center justify-center"
        hover="bg-active"
        relative my1 block h-10 w-10 select-none rounded-xl p1 text-secondary
        exact-active-class="!text-primary bg-active"
      >
        <TabIcon
          text-xl
          icon="i-carbon-settings-adjust" title="Settings" :show-title="false"
        />
      </NuxtLink>
    </div>
  </div>
</template>
