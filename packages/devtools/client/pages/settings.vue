<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
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
const { t } = useI18n()

const editorOptions = computed(() => [
  [
    t('settings.editorAuto'),
    undefined,
  ],
  ['VS Code', 'vscode'],
  ['VS Code Insider', 'vscode-insider'],
  ['Cursor', 'cursor'],
  ['Zed', 'zed'],
  ['Zed (zeditor)', 'zeditor'],
  ['WebStorm', 'webstorm'],
  ['Sublime Text', 'subl'],
  ['Atom', 'atom'],
  ['Windsurf', 'windsurf'],
])

const scaleOptions = computed(() => [
  [
    t('settings.scale.tiny'),
    12 / 15,
  ],
  [
    t('settings.scale.small'),
    14 / 15,
  ],
  [
    t('settings.scale.normal'),
    1,
  ],
  [
    t('settings.scale.large'),
    16 / 15,
  ],
  [
    t('settings.scale.huge'),
    18 / 15,
  ],
])

async function clearOptions() {
  // eslint-disable-next-line no-alert
  if (confirm(t('settings.resetConfirm'))) {
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
      :text="$t('settings.title')"
    />
    <div grid="~ lg:cols-2 gap-x-10 gap-y-3" max-w-300>
      <div flex="~ col gap-2">
        <h3 text-lg>
          {{ $t('settings.appearance') }}
        </h3>
        <NCard p4 flex="~ col gap-2">
          <p>{{ $t('settings.uiScale') }}</p>
          <NSelect v-model="scale" n="primary">
            <option v-for="i of scaleOptions" :key="i[0]" :value="i[1]">
              {{ i[0] }}
            </option>
          </NSelect>
        </NCard>

        <h3 mt2 text-lg>
          {{ $t('settings.features') }}
        </h3>
        <NCard p4 flex="~ col gap-2">
          <NCheckbox v-model="showHelpButtons" n-primary>
            <span>{{ $t('settings.showHelpButtons') }}</span>
          </NCheckbox>

          <div mx--2 my1 h-1px border="b base" op75 />

          <p>{{ $t('settings.openInEditor') }}</p>
          <NSelect v-model="openInEditor" n-primary>
            <option v-for="i of editorOptions" :key="i[0]" :value="i[1]">
              {{ i[0] }}
            </option>
          </NSelect>
        </NCard>

        <h3 mt2 text-lg>
          {{ $t('settings.feedback') }}
        </h3>
        <NCard p4 flex="~ col gap-2">
          <NCheckbox v-model="telemetryEnabled" n-primary>
            <span>{{ $t('settings.telemetry') }}</span>
            <NLink href="https://github.com/nuxt/devtools#anonymous-usage-analytics" target="_blank" ml1 op50 v-text="$t('settings.learnMore')" />
          </NCheckbox>

          <div mx--2 my1 h-1px border="b base" op75 />

          <div flex="~ gap-2">
            <NButton n="blue" to="https://github.com/nuxt/devtools/discussions/29" target="_blank">
              <div i-carbon-data-enrichment />
              {{ $t('settings.ideas') }}
            </NButton>
            <NButton n="orange" to="https://github.com/nuxt/devtools/issues" target="_blank">
              <div i-carbon-debug />
              {{ $t('settings.bugReports') }}
            </NButton>
          </div>
        </NCard>

        <h3 mt2 text-lg>
          {{ $t('settings.debug') }}
        </h3>
        <div flex="~ gap-2">
          <NButton n="orange" @click="clearOptions">
            <div i-carbon-breaking-change />
            {{ $t('settings.reset') }}
          </NButton>
        </div>
      </div>
    </div>
  </div>
</template>
