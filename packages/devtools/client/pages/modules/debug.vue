<script setup lang="ts">
import { definePageMeta } from '#imports'
import DebugModuleMutationRecords from '~/components/DebugModuleMutationRecords.vue'
import { useServerDebugContext } from '~/composables/state'

definePageMeta({
  icon: 'i-carbon-debug',
  title: 'Debug',
  category: 'advanced',
})

const context = useServerDebugContext()
</script>

<template>
  <div v-if="!context" p6>
    <div>No Debug Context Found</div>
    <div>Set `debug: true` in your nuxt.config.ts to enable this panel</div>
  </div>
  <div v-else>
    <NSectionBlock
      icon="carbon-container-image-push-pull"
      text="Module Mutation Records"
      description="Records of module mutations to nuxt options"
    >
      <DebugModuleMutationRecords
        :module-mutation-records="context.moduleMutationRecords || []"
      />
    </NSectionBlock>
  </div>
</template>
