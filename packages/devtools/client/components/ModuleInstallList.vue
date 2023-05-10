<script setup lang="ts">
// @ts-expect-error missing types
import { RecycleScroller } from 'vue-virtual-scroller'
import type { InstallModuleReturn, ModuleStaticInfo } from '../../src/types'
import Fuse from 'fuse.js'

const Dialog = createTemplatePromise<boolean, [info: ModuleStaticInfo, result: InstallModuleReturn]>()
const collection = await useModulesInfo()
const nuxt3only = collection.filter(i => i.compatibility.nuxt.includes('^3'))

const router = useRouter()
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

async function install(item: ModuleStaticInfo) {
  const result = await rpc.installNuxtModule(item.npm, true)

  if (!result.commands)
    return

  if (!await Dialog.start(item, result))
    return

  router.push(`/modules/terminals?id=${encodeURIComponent(result.processId)}`)
  await rpc.installNuxtModule(item.npm, false)
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
      <ModuleItemBase :mod="{}" :info="args[0]" border="none" w-150 n-panel-grids />
      <div flex="~ col gap-2" w-150 p4 border="t base">
        <h2 text-xl>
          Installing <span capitalize text-primary>{{ args[0].name }}</span> module?
        </h2>

        <p op50>
          Following command will be executed in your terminal:
        </p>
        <NCodeBlock :code="args[1].commands.join(' ')" lang="bash" px4 py2 border="~ base rounded" :lines="false" />

        <p op50>
          Then your Nuxt config will be updated as:
        </p>

        <CodeDiff
          :from="args[1].configOriginal"
          :to="args[1].configGenerated"
          max-h-80 of-auto px4 py2 border="~ base rounded"
          lang="ts"
        />

        <p>
          <span op50>After module installed, Nuxt will </span><span text-orange>restart automatically</span>.
        </p>

        <div flex="~ gap-3" mt2 justify-end>
          <NButton @click="resolve(false)">
            Cancel
          </NButton>
          <NButton n="solid primary" @click="resolve(true)">
            Install
          </NButton>
        </div>
      </div>
    </NDialog>
  </Dialog>
</template>
