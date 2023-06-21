<script setup lang="ts">
onMounted(async () => {
  if (!isDevAuthed.value) {
    if (devAuthToken.value) {
      const result = await rpc.verifyAuthToken(devAuthToken.value)
      if (result)
        isDevAuthed.value = true
    }
  }
  if (!isDevAuthed.value)
    rpc.requestForAuth()
})
</script>

<template>
  <NPanelGrids v-if="!isDevAuthed">
    <NCard flex="~ col gap-2" mxa items-center p6 text-center>
      <h3 class="mb2 text-lg font-medium leading-6" flex="~ items-center gap-1" text-orange>
        <span class="i-carbon-information-square" /> Permissions required
      </h3>
      <p>
        This operation requires permissions for running command and access files from the browser.
      </p>
      <p>
        A request is sent to the server.<br>
        Please check your terminal for the instructions and then come back.
      </p>
      <div flex="~ gap-3" mt2 justify-end>
        <NButton disabled icon="i-carbon-time">
          Waiting for authorization...
        </NButton>
      </div>
    </NCard>
  </NPanelGrids>
  <template v-else>
    <slot />
  </template>
</template>
