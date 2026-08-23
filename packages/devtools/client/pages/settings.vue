<script setup lang="ts">
import { definePageMeta } from '#imports'
import { useClient } from '~/composables/client'
import { rpc } from '~/composables/rpc'
import { telemetryEnabled } from '~/composables/telemetry'
import { useDevToolsOptions } from '../composables/storage-options'

definePageMeta({
  layout: 'full',
})

const {
  showHelpButtons,
  scale,
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
  ['Zed (zeditor)', 'zeditor'],
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
          Appearance
        </h3>
        <NCard p4 flex="~ col gap-2">
          <p>UI Scale</p>
          <NSelect v-model="scale" n="primary">
            <option v-for="i of scaleOptions" :key="i[0]" :value="i[1]">
              {{ i[0] }}
            </option>
          </NSelect>
        </NCard>

        <h3 mt2 text-lg>
          Features
        </h3>
        <NCard p4 flex="~ col gap-2">
          <NCheckbox v-model="showHelpButtons" n-primary>
            <span>Show help buttons</span>
          </NCheckbox>

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
