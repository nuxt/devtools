<script setup lang="ts">
import { useNuxtApp } from '#app/nuxt'
import { createTemplatePromise } from '@vueuse/core'
import { useClient } from '~/composables/client'
import { ensureDevAuthToken } from '~/composables/dev-auth'
import { useRestartDialogs } from '~/composables/dialog'
import { rpc } from '~/composables/rpc'

const nuxt = useNuxtApp()
const state = useRestartDialogs()
const client = useClient()

const PromiseConfirm = createTemplatePromise<boolean, [string]>()

// @ts-expect-error - missing type
nuxt.hook('devtools:terminal:exit', ({ id, code }) => {
  if (code === 0) {
    const dialog = state.value.find(dialog => dialog.id === id)
    if (dialog) {
      state.value = state.value.filter(dialog => dialog.id !== id)
      PromiseConfirm
        .start(dialog.message)
        .then(async (result) => {
          if (result) {
            rpc.restartNuxt(await ensureDevAuthToken())
            setTimeout(() => {
              client.value?.app.reload()
            }, 500)
          }
        })
    }
  }
})
</script>

<template>
  <PromiseConfirm v-slot="{ resolve, args }">
    <NDialog :model-value="true" @close="resolve(false)">
      <div p4 flex="~ col gap-1">
        <h3 class="text-lg font-medium leading-6">
          Restart
        </h3>
        <p op50>
          {{ args[0] }}
        </p>
        <div flex="~ gap-3" mt2 justify-end>
          <NButton @click="resolve(false)">
            Cancel
          </NButton>
          <NButton n="solid primary" @click="resolve(true)">
            Update
          </NButton>
        </div>
      </div>
    </NDialog>
  </PromiseConfirm>
</template>
