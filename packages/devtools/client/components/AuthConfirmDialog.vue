<script setup lang="ts">
import { AuthConfirm } from '~/composables/dialog'
</script>

<template>
  <AuthConfirm v-slot="{ resolve }">
    <NDialog :model-value="!isDevAuthed" class="border-none" @close="resolve(false)">
      <AuthRequiredPanel>
        <template #actions>
          <NButton @click="resolve(false)">
            Cancel
          </NButton>
        </template>
      </AuthRequiredPanel>
    </NDialog>
  </AuthConfirm>
</template>
