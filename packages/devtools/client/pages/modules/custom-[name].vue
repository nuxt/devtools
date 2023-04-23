<script setup lang="ts">
import type { ModuleCustomTab } from '~/../src/types'

definePageMeta({
  layout: 'full',
})

const route = useRoute()
const router = useRouter()
const name = computed(() => route.params.name)
const tabs = useAllTabs()
const tab = computed(() => tabs.value.find(i => i.name === name.value) as ModuleCustomTab)

onMounted(() => {
  // if the tab is not found and passed a certain timeout, redirect to the overview page
  if (!tab.value) {
    setTimeout(() => {
      if (!tab.value)
        router.push('/modules/overview')
    }, 2000)
  }
})
</script>

<template>
  <template v-if="!tab">
    <NPanelGrids>
      <div flex="~ col gap2" mxa items-center>
        <div i-carbon-queued mb2 text-5xl op50 />
        <p text-xl>
          Tab <code text-rose>{{ name }}</code> not found
        </p>
        <p op50>
          It might because the module contributing this tab is not installed or enabled
        </p>
        <p mt8 animate-pulse>
          Redirecting to overview page...
        </p>
      </div>
    </NPanelGrids>
  </template>
  <template v-else-if="tab.view.type === 'iframe'">
    <IframeView :tab="tab" />
  </template>
  <template v-else-if="tab.view.type === 'vnode'">
    <Component :is="tab.view.vnode" />
  </template>
  <template v-else-if="tab.view.type === 'launch'">
    <LaunchPage
      :icon="tab.view.icon || tab.icon"
      :title="tab.view.title || tab.title"
      :description="tab.view.description"
      :actions="tab.view.actions"
      @action="idx => rpc.customTabAction(tab.name, idx)"
    />
  </template>
  <template v-else>
    <NPanelGrids>
      <NCard flex="~ col" h-full items-center justify-center>
        Unknown tab type {{ tab.view }}
      </NCard>
    </NPanelGrids>
  </template>
</template>
