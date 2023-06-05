<script setup lang="ts">
import { AuthComfirm } from '~/composables/dialog'
</script>

<template>
  <AuthComfirm v-slot="{ resolve }">
    <NDialog :model-value="true" @close="resolve(false)">
      <div p4 flex="~ col gap-2">
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
          <NButton @click="resolve(false)">
            Cancel
          </NButton>
          <NButton disabled icon="i-carbon-time">
            Waiting for authorization...
          </NButton>
        </div>
      </div>
    </NDialog>
  </AuthComfirm>
</template>
