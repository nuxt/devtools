<script setup lang="ts">
const route = useRoute()
const routePath = computed(() => route.path.replace(/^\/__/, '').replace('/modules/', ''))

const allTabs = useEnabledTabs()
const tabs = computed(() => allTabs.value
  // eslint-disable-next-line @typescript-eslint/prefer-ts-expect-error
  // @ts-ignore - type
  .filter(tab => tab?.path)
  .map(tab => ({
    ...tab,
    name: tab.name.replace(/^modules-/, ''),
  }))
  .filter(tab => tab.name !== routePath.value),
)

const PageComponent = shallowRef()
const focused = ref(false)
const tabIndex = ref(0)
const input = ref('')

const filtered = computed(() => tabs.value.filter(tab => tab.name.includes(input.value)))

const currentTab = computed(() => tabs.value.find(tab => tab.name === input.value))
const currentPage = computed(() => PageComponent.value?.name ? PageComponent.value?.__asyncResolved?.__name ? PageComponent.value?.__asyncResolved?.__name : input.value : '?')

async function navigate() {
  if (currentTab.value && currentPage.value !== input.value)
    PageComponent.value = defineAsyncComponent(() => import(`../pages/modules/${input.value}.vue`))
}

function moveSelected(delta: number) {
  tabIndex.value = ((tabIndex.value + delta) + filtered.value.length) % filtered.value.length
  scrollToITem()
}

function scrollToITem() {
  const item = document.getElementById(filtered.value[tabIndex.value]?.name)
  item?.scrollIntoView({
    block: 'center',
  })
}

useEventListener('keydown', (e) => {
  if (focused.value) {
    if (e.key === 'Tab') {
      e.preventDefault()
      if (input.value) {
        const nearest = tabs.value.find(tab => tab.name.includes(input.value))?.name
        if (nearest)
          input.value = nearest
      }
    }
    else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault()
      moveSelected(e.key === 'ArrowDown' ? 1 : -1)
    }
    else if (e.key === 'Enter') {
      const item = filtered.value[tabIndex.value]
      if (item) {
        e.preventDefault()
        input.value = item.name
        navigate()
      }
    }
    else if (e.key === 'Escape') {
      e.preventDefault()
      focused.value = false
      const el = document.activeElement as HTMLInputElement
      el.blur()
    }
  }
})

function closeSplitScreen() {
  splitScreen.value = false
}
</script>

<template>
  <div h-full h-screen of-hidden pb-20 border="l base">
    <div border="b base" flex="~ col gap1" z-99 px4 py3 navbar-glass>
      <div flex>
        <div>
          <template v-if="currentPage !== input">
            <span op50>Navigate from </span>
            <span font-mono>{{ currentPage }}</span>
            <span op50> to </span>
          </template>
          <span v-else op50>Edit path below to navigate</span>
        </div>
        <div flex-auto />
        <div v-if="currentPage !== input && input">
          <span v-if="currentTab">Press <b font-bold text-primary>Enter</b> to navigate</span>
          <span v-else text-orange op75>
            <small v-if="routePath === input">
              You can't have the same page open twice
            </small>
            <template v-else>
              (no match)
            </template>
          </span>
        </div>
      </div>
      <div flex="~ gap2">
        <div
          class="relative w-full flex items-center border border-base rounded py-1 pl-1 pr-2"
          :class="currentPage === input ? 'text-blue' : currentTab ? 'text-green' : 'text-orange'"
        >
          <NIcon icon="carbon-direction-right-01 scale-y--100" class="ml-0.3em mr-0.1em text-1.1em op50" />
          <input
            v-model="input"
            class="ml-0.4em w-full flex-auto font-mono bg-base !outline-none"
            @focus="focused = true"
            @blur="focused = false"
            @keydown.enter="navigate"
          >
          <NIconButton v-if="!currentTab && input" n="xs" icon="carbon:close" op50 @click="input = ''" />
          <NIcon v-else :icon="currentTab?.icon" op50 />
          <div
            v-if="filtered.length && focused"
            border="r l b base rounded-b"
            class="absolute left-0 right-0 top-30px z--1 shadow-lg bg-base"
          >
            <div max-h-40 w-full of-auto text-gray>
              <button
                v-for="item, index in filtered"
                :id="item.name"
                :key="item.name"
                hover="text-blue bg-active"
                :class="{ 'text-blue bg-active': tabIndex === index }"
                flex="~ gap-2" w-full items-center px4 py2 text-sm
                :border="index !== filtered.length - 1 ? 'b base' : ' base'"
                @mousedown.prevent="input = item.name;navigate()"
              >
                <NIcon :icon="item?.icon" />
                {{ item.name }}
                <div flex-auto />
                <NIcon v-if="tabIndex === index" icon="carbon-text-new-line scale-x--100" class="ml-0.3em mr-0.1em text-1.1em op50" />
              </button>
            </div>
            <footer border="t base" flex="~ none justify-between items-center gap-4" pointer-events-none px4 py1 text-blue>
              <div text-xs flex="~ items-center gap2">
                <NButton n="xs" px1>
                  <NIcon icon="carbon-arrow-down" />
                </NButton>
                <NButton n="xs" px1>
                  <NIcon icon="carbon-arrow-up" />
                </NButton>
                <span op75>to navigate</span>
              </div>
              <div text-xs flex="~ items-center gap2">
                <NButton n="xs" px1>
                  Esc
                </NButton>
                <span op75>to close</span>
              </div>
              <div text-xs flex="~ items-center gap2">
                <NButton n="xs" px1>
                  <NIcon icon="i-carbon-text-new-line scale-x--100" />
                </NButton>
                <span op75>to select</span>
              </div>
            </footer>
          </div>
        </div>
        <NButton n="xs orange" title="Unsplit Screen" @click="closeSplitScreen">
          <NIcon icon="i-carbon:side-panel-open" />
        </NButton>
      </div>
    </div>
    <template v-if="PageComponent?.name">
      <component :is="PageComponent" />
    </template>
    <NPanelGrids v-else>
      <NCard flex="~ col gap-2 items-center" p6>
        <NIcon icon="i-carbon-split-screen" h-20 w-20 />
        <span text="lg blue">
          Welcome to Split Screen Mode
        </span>
        <NButton n="xs orange" @click="closeSplitScreen">
          Unsplit Screen
          <NIcon icon="i-carbon:side-panel-open" />
        </NButton>
      </NCard>
    </NPanelGrids>
  </div>
</template>
