<script setup lang="ts">
const allTabs = useEnabledTabs()
const tabs = computed(() => {
  // TODO: support also custom tabs, as we need to pass props, and route in
  return allTabs.value.filter(tab => 'path' in tab)
})

const PageComponent = shallowRef()

const categories = getCategorizedTabs(tabs)
const router = useRouter()
const route = useRoute()

const currentTab = computed(() => tabs.value.find(tab => tab.name === splitScreenView.value))

watch(
  () => currentTab.value,
  (tab) => {
    if (!tab)
      return
    const routes = router.getRoutes()
    const matched = tab && 'path' in tab
      ? routes
        .find(route => route.path === tab.path)
      : routes.find(route => route.path === `/modules/custom-${tab.name}`)
    // if it's the same route as the main view, skip
    if (matched?.path === route.path) {
      PageComponent.value = undefined
      return
    }
    const component = matched?.components?.default
    if (typeof component === 'function')
      PageComponent.value = defineAsyncComponent(component as any)
    else
      PageComponent.value = component
  },
  { immediate: true },
)

function closeSplitScreen() {
  splitScreenEnabled.value = false
}
</script>

<template>
  <div h-full h-screen of-hidden>
    <div border="b base" flex="~ gap1" z-99 px4 py3 navbar-glass>
      <VDropdown placement="bottom-start">
        <div flex="~ gap-2 items-center" cursor-pointer select-none>
          <div i-carbon-chevron-down text-sm op50 />
          <template v-if="currentTab">
            <TabIcon
              text-xl
              :icon="currentTab.icon" :title="currentTab.title" :show-title="false"
            />
            <span>{{ currentTab.title }}</span>
          </template>
          <template v-else>
            Select a tab
          </template>
        </div>
        <template #popper>
          <TabsGrid :categories="categories" target="side" />
        </template>
      </VDropdown>
      <div flex-auto />
      <NIconButton
        icon="i-carbon:side-panel-open"
        title="Close split screen"
        @click="closeSplitScreen"
      />
    </div>
    <template v-if="PageComponent">
      <component :is="PageComponent" />
    </template>
    <NPanelGrids v-else>
      <span text-lg op50>
        Select a tab to start
      </span>
      <NCard px4 py2>
        <TabsGrid :categories="categories" target="side" />
      </NCard>
      <NButton n="sm orange" mt2 @click="closeSplitScreen">
        Close Split Screen
      </NButton>
    </NPanelGrids>
  </div>
</template>
