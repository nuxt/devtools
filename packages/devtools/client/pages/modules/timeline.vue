<script setup lang="ts">
definePageMeta({
  icon: 'i-carbon-roadmap',
  title: 'Timeline',
  category: 'analyze',
})

const options = useModuleOptions()
const config = useServerConfig()

const Dialog = createTemplatePromise<boolean, [string, string]>()

const openInEditor = useOpenInEditor()

async function showPopup() {
  const [source, modified] = await rpc.enableTimeline(true)
  if (!await Dialog.start(source, modified))
    return
  await rpc.enableTimeline(false)
}
</script>

<template>
  <TimelineView v-if="options?.timeline?.enabled" />
  <template v-else>
    <NPanelGrids>
      <LaunchPage
        icon="i-carbon-roadmap"
        title="Timeline"
        description="Timeline enables the inspection of when composable being executed and the route changes."
        :actions="[
          {
            label: 'Enable',
          },
        ]"
        @action="showPopup"
      />
    </NPanelGrids>
    <Dialog v-slot="{ resolve, args }">
      <NDialog :model-value="true" @close="resolve(false)">
        <div flex="~ col gap-2" w-150 p4 border="t base">
          <h2 text-xl>
            <span capitalize>Enable Timeline?</span>
          </h2>

          <p op50>
            Your <NLink role="button" n="primary" underline @click="openInEditor(config?._nuxtConfigFile)" v-text="'Nuxt config'" /> will be updated as:
          </p>

          <CodeDiff
            :from="args[0]"
            :to="args[1]"
            max-h-80 of-auto py2 border="~ base rounded"
            lang="ts"
          />

          <p>
            <span op50>Then Nuxt will </span><span text-orange>restart automatically</span>.
          </p>

          <div flex="~ gap-3" mt2 justify-end>
            <NButton @click="resolve(false)">
              Cancel
            </NButton>
            <NButton n="solid primary" capitalize @click="resolve(true)">
              Enable
            </NButton>
          </div>
        </div>
      </NDialog>
    </Dialog>
  </template>

  <HelpFab>
    <DocsTimeline />
  </HelpFab>
</template>
