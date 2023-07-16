<script setup lang="ts">
const allTabs = useEnabledTabs()

const PageComponent = shallowRef()

const route = useRoute()
const router = useRouter()
const tabs = computed(() => allTabs.value.filter(tab => tab.name !== route.name && tab.name !== route.params?.name))
const categories = getCategorizedTabs(tabs)

const currentTab = computed(() => tabs.value.find(tab => tab.name === splitScreenView.value))

watch(
  () => currentTab.value,
  (tab) => {
    if (!tab)
      return
    const routes = router.getRoutes()
    const matched = tab && 'path' in tab
      ? routes.find(route => route.path === tab.path)
      : routes.find(route => route.name === 'modules-custom-name')
    // if it's the same route as the main view, skip
    if (matched?.path === route.path || route.params?.name === tab.name) {
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

const gridPanel = ref()
const gridPanelButton = ref()
const showGridPanel = ref(false)

onClickOutside(gridPanel, (e) => {
  if (gridPanelButton.value && e.composedPath().includes(gridPanelButton.value))
    return
  showGridPanel.value = false
}, { detectIframe: true })
</script>

<template>
  <div h-full h-screen of-hidden>
    <div border="b base" flex="~ gap1" z-99 px4 py3 navbar-glass>
      <VDropdown
        placement="bottom-start"
        :distance="12"
        :skidding="5"
        :triggers="[]"
        :shown="showGridPanel"
        :auto-hide="true"
      >
        <div ref="gridPanelButton" flex="~ gap-2 items-center" cursor-pointer select-none @click="showGridPanel = !showGridPanel">
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
          <TabsGrid ref="gridPanel" :categories="categories" target="side" />
        </template>
      </VDropdown>
      <div flex-auto />
      <NIconButton
        icon="i-carbon:side-panel-open"
        title="Close split screen"
        @click="closeSplitScreen"
      />
    </div>
    <div v-if="PageComponent && currentTab" of-auto style="height: calc(100% - 50px)">
      <component :is="PageComponent" v-if="'view' in currentTab" :split="currentTab.name" />
      <component :is="PageComponent" v-else />
    </div>
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
