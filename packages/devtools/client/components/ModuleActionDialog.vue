<script setup lang="ts">
import { ModuleDialog } from '../composables/dialog'

const config = useServerConfig()
const openInEditor = useOpenInEditor()

const anyObj = {} as any
</script>

<template>
  <ModuleDialog v-slot="{ resolve, args }">
    <NDialog :model-value="true" @close="resolve(false)">
      <ModuleItemBase :mod="anyObj" :info="args[0]" border="none" w-150 n-panel-grids />
      <div flex="~ col gap-2" w-150 p4 border="t base">
        <h2 text-xl :class="args[2] === 'install' ? 'text-primary' : 'text-red'">
          <span capitalize>{{ args[2] }}</span> <code>{{ args[0].name }}</code>?
        </h2>

        <p op50>
          Following command will be executed in your terminal:
        </p>
        <NCodeBlock :code="args[1].commands.join(' ')" lang="bash" px4 py2 border="~ base rounded" :lines="false" />

        <p op50>
          Then your <NLink role="button" n="primary" @click="openInEditor(config?._nuxtConfigFile)" v-text="'Nuxt config'" /> will be updated as:
        </p>

        <CodeDiff
          :from="args[1].configOriginal"
          :to="args[1].configGenerated"
          max-h-80 of-auto py2 border="~ base rounded"
          lang="ts"
        />

        <p>
          <span op50>After that, Nuxt will </span><span text-orange>restart automatically</span>.
        </p>

        <div flex="~ gap-3" mt2 justify-end>
          <NTip n="sm purple" flex-auto icon="carbon-chemistry">
            Experimental. Backup your project first.
          </NTip>

          <NButton @click="resolve(false)">
            Cancel
          </NButton>
          <NButton n="solid" capitalize :class="args[2] === 'install' ? 'n-primary' : 'n-red'" @click="resolve(true)">
            {{ args[2] }}
          </NButton>
        </div>
      </div>
    </NDialog>
  </ModuleDialog>
</template>
