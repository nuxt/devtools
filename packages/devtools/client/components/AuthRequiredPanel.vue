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

const authInput = ref('')
const isFailed = ref(false)

async function input() {
  const token = authInput.value.trim()
  isFailed.value = false
  await rpc.verifyAuthToken(token)
    .then((result) => {
      if (result) {
        isDevAuthed.value = true
        updateDevAuthToken(token)
      }
      else {
        isFailed.value = true
      }
    })
}
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
      <p>Or you can manually paste the token here:</p>
      <form flex="~ inline gap-2 items-center" @submit.prevent="input">
        <NTextInput
          v-model="authInput" placeholder="Enter token here"
          :n="isFailed ? 'red' : undefined"
          @keydown.enter="input"
        />
        <NIconButton icon="i-carbon-arrow-right" @click="input" />
      </form>
    </NCard>
  </NPanelGrids>
  <template v-else>
    <slot />
  </template>
</template>
