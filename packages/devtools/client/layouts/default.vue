<script setup lang="ts">
const client = useClient()
const waiting = computed(() => !client.value && !showConnectionWarning.value)
const splitted = useLayoutSplitState()
</script>

<template>
  <div h-screen of-hidden font-sans bg-base>
    <Notification />
    <NLoading v-if="waiting">
      Connecting....
    </NLoading>
    <div v-else grid="~ cols-[50px_1fr]" h-full of-hidden>
      <SideNav of-x-hidden of-y-auto />
      <div v-if="!splitted" h-full of-auto>
        <slot />
      </div>
      <PanelLeftRight v-else storage-key="layout-split-screen" :min-size-left="30" :min-size-right="30" :default="50">
        <template #left>
          <slot />
        </template>
        <template #right>
          <!-- TODO: connect to the client app -->
          <iframe width="100%" height="100%" src="/__nuxt_devtools__/client/modules/overview" />
        </template>
      </PanelLeftRight>
    </div>
  </div>
</template>
