<script setup lang="ts">
import { definePageMeta } from '#imports'
import { watchEffect } from 'vue'
import { useClient } from '~/composables/client'
import { rpc } from '~/composables/rpc'
import { getCategorizedTabs, useAllTabs } from '~/composables/state-tabs'
import { telemetryEnabled } from '~/composables/telemetry'
import { useDevToolsOptions } from '../composables/storage-options'

definePageMeta({
  layout: 'full',
})

const {
  interactionCloseOnOutsideClick,
  showPanel,
  showHelpButtons,
  scale,
  hiddenTabs,
  pinnedTabs,
  hiddenTabCategories,
  minimizePanelInactive,
  sidebarExpanded,
  sidebarScrollable,
} = useDevToolsOptions('ui')

const {
  openInEditor,
} = useDevToolsOptions('behavior')

const client = useClient()

const editorOptions = [
  ['Auto', undefined],
  ['VS Code', 'vscode'],
  ['VS Code Insider', 'vscode-insider'],
  ['Cursor', 'cursor'],
  ['Zed', 'zed'],
  ['WebStorm', 'webstorm'],
  ['Sublime Text', 'sublime'],
  ['Atom', 'atom'],
  ['Windsurf', 'windsurf'],
]

const scaleOptions = [
  ['Tiny', 12 / 15],
  ['Small', 14 / 15],
  ['Normal', 1],
  ['Large', 16 / 15],
  ['Huge', 18 / 15],
]

const MinimizeInactiveOptions = [
  ['Always', 0],
  ['1s', 1000],
  ['2s', 2000],
  ['5s', 5000],
  ['10s', 10000],
  ['Never', -1],
]

const categories = getCategorizedTabs(useAllTabs())

function toggleTab(name: string, v?: boolean) {
  if (v)
    hiddenTabs.value = hiddenTabs.value.filter(i => i !== name)
  else
    hiddenTabs.value.push(name)
}

function toggleTabCategory(name: string, v?: boolean) {
  if (v)
    hiddenTabCategories.value = hiddenTabCategories.value.filter(i => i !== name)
  else
    hiddenTabCategories.value.push(name)
}

function togglePinTab(name: string) {
  if (pinnedTabs.value.includes(name))
    pinnedTabs.value = pinnedTabs.value.filter(i => i !== name)
  else
    pinnedTabs.value.push(name)
}

function pinMove(name: string, delta: number) {
  const index = pinnedTabs.value.indexOf(name)
  if (index === -1)
    return

  const newIndex = index + delta
  if (newIndex < 0 || newIndex >= pinnedTabs.value.length)
    return

  const newPinnedTabs = [...pinnedTabs.value]
  newPinnedTabs.splice(index, 1)
  newPinnedTabs.splice(newIndex, 0, name)
  pinnedTabs.value = newPinnedTabs
}

async function clearOptions() {
  // eslint-disable-next-line no-alert
  if (confirm('Are you sure you to reset all local settings & state? The app will reload.')) {
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith('nuxt-devtools-'))
        localStorage.removeItem(key)
    })
    await rpc.clearOptions()
    client.value?.app?.reload?.()
    window.location.reload()
  }
}

// sync devtools options with frame state
watchEffect(() => {
  if (client.value)
    client.value.app.frameState.value.closeOnOutsideClick = interactionCloseOnOutsideClick.value
})

watchEffect(() => {
  if (client.value)
    client.value.app.frameState.value.minimizePanelInactive = minimizePanelInactive.value
})
</script>

<template>
  <div px8 py6>
    <NIconTitle
      class="mb-5 text-xl op75"
      icon="i-carbon-settings-adjust"
      text="DevTools Settings"
    />
    <div grid="~ lg:cols-2 gap-x-10 gap-y-3" max-w-300>
      <div flex="~ col gap-2">
        <h3 text-lg>
          Tabs
        </h3>
        <template v-for="[name, tabs] of categories" :key="name">
          <NCard
            v-if="tabs.length" p3 flex="~ col gap-1"
            :class="hiddenTabCategories.includes(name) ? 'op50 grayscale' : ''"
          >
            <NSwitch
              flex="~ row-reverse" py1 pl2 pr1 n-lime
              :model-value="!hiddenTabCategories.includes(name)"
              @update:model-value="(v) => toggleTabCategory(name, v)"
            >
              <div flex="~ gap-2" flex-auto items-center justify-start>
                <span capitalize op75>{{ name }}</span>
              </div>
            </NSwitch>

            <div mx--1 my1 h-1px border="b base" op75 />

            <template v-for="tab of tabs" :key="tab.name">
              <NSwitch
                flex="~ row-reverse" py1 pl2 pr1 n-primary
                :model-value="!hiddenTabs.includes(tab.name)"
                @update:model-value="(v) => toggleTab(tab.name, v)"
              >
                <div flex="~ gap-2" flex-auto items-center justify-start of-hidden pr-4 :class="hiddenTabs.includes(tab.name) ? 'op25' : ''">
                  <TabIcon text-xl :icon="tab.icon" :title="tab.title" />
                  <span flex-auto overflow-hidden text-ellipsis ws-nowrap>{{ tab.title }}</span>
                  <template v-if="pinnedTabs.includes(tab.name)">
                    <NButton
                      icon="i-carbon-caret-up"
                      :disabled="pinnedTabs.indexOf(tab.name) === 0"
                      :border="false"
                      @click="pinMove(tab.name, -1)"
                    />
                    <NButton
                      icon="i-carbon-caret-down"
                      :disabled="pinnedTabs.indexOf(tab.name) === pinnedTabs.length - 1"
                      :border="false"
                      @click="pinMove(tab.name, 1)"
                    />
                  </template>
                  <NButton
                    :icon="pinnedTabs.includes(tab.name) ? ' i-carbon-pin-filled rotate--45' : ' i-carbon-pin op50'"
                    :border="false"
                    @click="togglePinTab(tab.name)"
                  />
                </div>
              </NSwitch>
            </template>
          </NCard>
        </template>
      </div>
      <div flex="~ col gap-2">
        <h3 text-lg>
          Appearance
        </h3>
        <NCard p4 flex="~ col gap-2">
          <div>
            <NDarkToggle v-slot="{ toggle, isDark }">
              <NButton n="primary" @click="toggle">
                <div i-carbon-sun dark:i-carbon-moon translate-y--1px /> {{ isDark.value ? 'Dark' : 'Light' }}
              </NButton>
            </NDarkToggle>
          </div>
          <div mx--2 my1 h-1px border="b base" op75 />
          <p>UI Scale</p>
          <NSelect v-model="scale" n="primary">
            <option v-for="i of scaleOptions" :key="i[0]" :value="i[1]">
              {{ i[0] }}
            </option>
          </NSelect>
          <div mx--2 my1 h-1px border="b base" op75 />
          <NCheckbox v-model="sidebarExpanded" n-primary>
            <span>
              Expand Sidebar
            </span>
          </NCheckbox>
          <NCheckbox v-model="sidebarScrollable" :disabled="sidebarExpanded" n-primary>
            <span>
              Scrollable Sidebar
            </span>
          </NCheckbox>
        </NCard>

        <h3 mt2 text-lg>
          Features
        </h3>
        <NCard p4 flex="~ col gap-2">
          <NCheckbox v-model="interactionCloseOnOutsideClick" n-primary>
            <span>Close DevTools when clicking outside</span>
          </NCheckbox>
          <!-- <NCheckbox v-model="showExperimentalFeatures" n-primary>
            <span>Show experimental features</span>
          </NCheckbox> -->
          <NCheckbox v-model="showHelpButtons" n-primary>
            <span>Show help buttons</span>
          </NCheckbox>

          <NCheckbox v-model="showPanel" n-primary>
            <span>Show the floating panel</span>
          </NCheckbox>

          <div mx--2 my1 h-1px border="b base" op75 />

          <p>Minimize floating panel on inactive</p>
          <NSelect v-model.number="minimizePanelInactive" n-primary>
            <option v-for="i of MinimizeInactiveOptions" :key="i[0]" :value="i[1]">
              {{ i[0] }}
            </option>
          </NSelect>

          <div mx--2 my1 h-1px border="b base" op75 />

          <p>Open In Editor</p>
          <NSelect v-model="openInEditor" n-primary>
            <option v-for="i of editorOptions" :key="i[0]" :value="i[1]">
              {{ i[0] }}
            </option>
          </NSelect>
        </NCard>

        <h3 mt2 text-lg>
          Feedback
        </h3>
        <NCard p4 flex="~ col gap-2">
          <NCheckbox v-model="telemetryEnabled" n-primary>
            <span>Send anonymous statistics, help us improving DevTools</span>
            <NLink href="https://github.com/nuxt/devtools#anonymous-usage-analytics" target="_blank" ml1 op50 v-text="'Learn more'" />
          </NCheckbox>

          <div mx--2 my1 h-1px border="b base" op75 />

          <div flex="~ gap-2">
            <NButton n="blue" to="https://github.com/nuxt/devtools/discussions/29" target="_blank">
              <div i-carbon-data-enrichment />
              Ideas & Suggestions
            </NButton>
            <NButton n="orange" to="https://github.com/nuxt/devtools/issues" target="_blank">
              <div i-carbon-debug />
              Bug Reports
            </NButton>
          </div>
        </NCard>

        <h3 mt2 text-lg>
          Debug
        </h3>
        <div flex="~ gap-2">
          <NButton n="orange" @click="clearOptions">
            <div i-carbon-breaking-change />
            Reset Local Settings & State
          </NButton>
        </div>
      </div>
    </div>
  </div>
</template>
