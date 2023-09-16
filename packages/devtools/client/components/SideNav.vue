<script setup lang="ts">
import TabsGrid from './TabsGrid.vue'

const client = useClient()
const allTabs = useEnabledTabs()
const { sidebarMinimized, sidebarScrollable } = useDevToolsUIOptions()

const showDocking = ref(false)
const showMoreTabs = ref(false)
const panel = ref()
const buttonDocking = ref<HTMLButtonElement>()
const buttonMoreTabs = ref<HTMLButtonElement>()

function toggleDocking() {
  showDocking.value = !showDocking.value
}
function toggleMoreTabs() {
  showMoreTabs.value = !showMoreTabs.value
}

function toggleSidebar() {
  sidebarMinimized.value = !sidebarMinimized.value
}

const ITEM_HEIGHT = 45

const { height: windowHeight } = useWindowSize()
const containerCapacity = computed(() => {
  const containerHeight = windowHeight.value - 130
  return Math.max(0, Math.floor(containerHeight / ITEM_HEIGHT))
})

const inlineTabs = computed(() => allTabs.value.slice(0, containerCapacity.value))
const overflowTabs = computed(() => allTabs.value.slice(containerCapacity.value))

const categorizedTabs = getCategorizedTabs(allTabs)
const categorizedInlineTabs = getCategorizedTabs(inlineTabs)
const categorizedOverflowTabs = getCategorizedTabs(overflowTabs)

onClickOutside(
  panel,
  (e) => {
    if (buttonDocking.value && e.composedPath().includes(buttonDocking.value))
      return
    if (buttonMoreTabs.value && e.composedPath().includes(buttonMoreTabs.value))
      return
    showDocking.value = false
    showMoreTabs.value = false
  },
  { detectIframe: true },
)
</script>

<template>
  <div id="nuxt-devtools-side-nav" border="r base" flex="~ col" z-100 h-full items-start of-hidden bg-base>
    <div :flex="`~ items-center justify-between ${sidebarMinimized ? 'none col' : ''}`" sticky top-0 z-1 w-full px3 bg-base border="b base">
      <VDropdown
        placement="left-start"
        :distance="12"
        :skidding="5"
        :triggers="[]"
        :shown="showDocking"
        :auto-hide="true"
      >
        <button
          ref="buttonDocking"
          flex="~ items-center justify-center"
          hover="bg-active"
          :w="sidebarMinimized ? '10' : 'full'"
          :rounded="sidebarMinimized ? 'xl' : ''"
          relative my1 h-10 select-none p2 text-secondary
          exact-active-class="!text-primary bg-active"
          :class="client ? '' : 'saturate-0'"
          :title="client ? 'Nuxt DevTools' : 'DevTools Client not connected, try open it in iframe mode'"
          @click="toggleDocking"
        >
          <div flex="~ items-center gap-2">
            <div i-logos-nuxt-icon h-6 w-6 />
            <span v-if="!sidebarMinimized" text="lg white" font-600>
              DevTools
            </span>
          </div>
        </button>
        <template #popper>
          <DockingPanel ref="panel" />
        </template>
      </VDropdown>
      <NIconButton
        v-if="!sidebarMinimized"
        v-tooltip="'Minimize Sidebar'"
        icon="carbon-close"
        title="Minimize Sidebar"
        @click="toggleSidebar"
      />
    </div>

    <div flex="~ auto col gap-0.5 items-center" w-full p1 class="no-scrollbar" :class="{ 'of-x-hidden of-y-auto': sidebarMinimized }">
      <template v-for="[name, tabs], idx of sidebarScrollable ? categorizedTabs : sidebarMinimized ? categorizedInlineTabs : categorizedTabs" :key="name">
        <template v-if="tabs.length">
          <div v-if="idx" my1 h-1px w-full border="b base" />
          <SideNavItem
            v-for="tab of tabs"
            :key="tab.name"
            :tab="tab"
            :minimized="sidebarMinimized"
          />
        </template>
      </template>
      <div flex-auto />
    </div>

    <div :flex="`~ items-center gap-1 ${sidebarMinimized ? 'none col' : ''}`" border="t base" sticky bottom-0 w-full p1 bg-base>
      <VDropdown
        v-if="overflowTabs.length && !sidebarScrollable && sidebarMinimized"
        placement="left-end"
        :distance="12"
        :triggers="[]"
        :shown="showMoreTabs"
        :auto-hide="true"
      >
        <button
          ref="buttonMoreTabs"
          flex="~"
          hover="bg-active" relative
          h-10 w-10 select-none items-center justify-center rounded-xl p1 text-secondary
          exact-active-class="!text-primary bg-active"
          @click="toggleMoreTabs"
        >
          <TabIcon
            text-xl
            icon="carbon:overflow-menu-vertical" title="More tabs" :show-title="false"
          />
          <div
            absolute bottom-0 right-0 h-4 w-4 rounded-full text-9px
            flex="~ items-center justify-center"
            border="~ base"
          >
            <span translate-y-0.5px>{{ overflowTabs.length }}</span>
          </div>
        </button>
        <template #popper>
          <TabsGrid :categories="categorizedOverflowTabs" max-w-80 target="main" />
        </template>
      </VDropdown>
      <SideNavItem
        :minimized="sidebarMinimized"
        :tab="{
          icon: 'i-carbon:settings-adjust',
          title: 'Settings',
          name: 'settings',
          path: '/settings',
        }"
      />
    </div>
  </div>
</template>
