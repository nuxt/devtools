<script setup lang="ts">
// @ts-expect-error missing types
import { RecycleScroller } from 'vue-virtual-scroller'
import { diffLines } from 'diff'
import type { ModuleStaticInfo } from '../../src/types'
import Fuse from 'fuse.js'

const Dialog = createTemplatePromise<boolean, [info: ModuleStaticInfo, command: string, modifiedConfig: string]>()
const collection = await useModulesInfo()
const nuxt3only = collection.filter(i => i.compatibility.nuxt.includes('^3'))

const search = ref('')
const fuse = computed(() => new Fuse(nuxt3only, {
  keys: [
    'name',
    'description',
    'npm',
    'category',
  ],
}))

const items = computed(() => {
  if (!search.value)
    return nuxt3only
  return fuse.value.search(search.value).map(r => r.item)
})

function printDiff(from: string, to: string) {
  const diffs = diffLines(from.trim(), to.trim())
  let output = ''

  // TODO: frame only the diff parts
  for (const diff of diffs) {
    const lines = diff.value.trimEnd().split('\n')
    for (const line of lines) {
      if (diff.added)
        output += `+ ${line}\n`
      else if (diff.removed)
        output += `- ${line}\n`
      else
        output += `  ${line}\n`
    }
  }
  return output
}

async function install(item: ModuleStaticInfo) {
  const command = await rpc.getNpmCommand('update', item.npm, { dev: true })
  if (!command)
    return

  const config = await rpc.installNuxtModule(item.npm, true)

  await Dialog.start(item, command.join(' '), printDiff(config.original, config.generated))
}
</script>

<template>
  <div h-full flex="~ col gap-4">
    <NIconTitle
      mx6 mt6
      text-xl op75
      icon="i-carbon-3d-mpr-toggle"
      text="Install Module"
    />

    <NTextInput
      v-model="search"
      placeholder="Search..."
      icon="carbon-search" n="primary"
      mx6 px-5 py-2
    />

    <div flex-auto of-auto flex="~ col gap-2" pl6 pr4>
      <RecycleScroller
        v-slot="{ item }"
        class="scroller"
        :items="items"
        :item-size="160"
        key-field="name"
      >
        <ModuleItemBase
          :mod="{}"
          role="button"
          :info="item"
          mb2 h-full class="hover:bg-active!"
          :compact="true"
          @click="install(item)"
        />
      </RecycleScroller>
    </div>
  </div>

  <Dialog v-slot="{ resolve, args }">
    <NDialog :model-value="true" @close="resolve(false)">
      <div flex="~ col gap-2" w-150 p4>
        <h2 text-xl>
          Installing module <span capitalize>{{ args[0].name }}</span>?
        </h2>
        <ModuleItemBase :mod="{}" :info="args[0]" />

        <p op50>
          The following command will be executed in your terminal:
        </p>
        <NCodeBlock :code="args[1]" lang="bash" px4 py2 border="~ base rounded" :lines="false" />

        <p op50>
          Then your Nuxt config will be updated as:
        </p>

        <NCodeBlock :code="args[2]" lang="diff" max-h-100 of-auto px4 py2 border="~ base rounded" />

        <div flex="~ gap-3" mt2 justify-end>
          <NButton @click="resolve(false)">
            Cancel
          </NButton>
          <NButton n="solid primary" @click="resolve(true)">
            Yes
          </NButton>
        </div>
      </div>
    </NDialog>
  </Dialog>
</template>
