<script setup lang="ts">
const client = useClient()
const allTabs = useEnabledTabs()

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

const ITEM_HEIGHT = 45

const { height: windowHeight } = useWindowSize()
const containerCapacity = computed(() => {
  const containerHeight = windowHeight.value - 130
  return Math.max(0, Math.floor(containerHeight / ITEM_HEIGHT))
})

const inlineTabs = computed(() => allTabs.value.slice(0, containerCapacity.value))
const overflowTabs = computed(() => allTabs.value.slice(containerCapacity.value))

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
  <div border="r base" flex="~ col" z-100 h-full items-center of-hidden bg-base>
    <div flex="~ none col items-center">
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
          flex="~"
          hover="bg-active"
          relative my1 h-10 w-10 select-none items-center justify-center rounded-xl p1
          text-secondary
          exact-active-class="!text-primary bg-active"
          :class="client ? '' : 'saturate-0'"
          :title="client ? 'Nuxt DevTools' : 'DevTools Client not connected, try open it in iframe mode'"
          @click="toggleDocking"
        >
          <div i-logos-nuxt-icon h-6 w-6 />
        </button>
        <template #popper>
          <DockingPanel ref="panel" />
        </template>
      </VDropdown>
      <div h-1px w-8 border="b base" />
    </div>

    <div flex="~ auto col gap-0.5 items-center" of-hidden py1>
      <template v-for="[name, tabs], idx of categorizedInlineTabs" :key="name">
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

    <div flex="~ none col items-center gap-1" pb1>
      <VDropdown
        v-if="overflowTabs.length"
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
          <div flex="~ col gap-1" max-w-80 py1>
            <template v-for="[name, tabs], idx of categorizedOverflowTabs" :key="name">
              <template v-if="tabs.length">
                <div v-if="idx" h-1px border="b base" />
                <div flex="~ wrap" px1>
                  <SideNavItem
                    v-for="tab of tabs"
                    :key="tab.name"
                    :tab="tab"
                  />
                </div>
              </template>
            </template>
          </div>
        </template>
      </VDropdown>
      <NuxtLink
        to="/settings"
        flex="~ items-center justify-center"
        hover="bg-active"
        relative block h-10 w-10 select-none rounded-xl p1 text-secondary
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
