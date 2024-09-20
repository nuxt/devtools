<script setup lang="ts">
import type { ModuleBuiltinTab, ModuleCustomTab } from '~/../src/types'
import { useRoute } from '#app/composables/router'
import { NuxtLink } from '#components'
import { computed, toValue } from 'vue'
import { splitScreenView } from '~/composables/storage'
import { telemetry } from '~/composables/telemetry'

const props = withDefaults(
  defineProps<{
    tab: ModuleCustomTab | ModuleBuiltinTab
    minimized?: boolean
    target?: 'main' | 'side'
  }>(),
  {
    minimized: true,
    target: 'main',
  },
)
const route = useRoute()

const tabPath = computed(() => 'path' in props.tab ? props.tab.path! : `/modules/custom-${props.tab.name}`)
const badge = computed(() => 'badge' in props.tab && props.tab.badge?.())
const isActive = computed(() => route.path.startsWith(tabPath.value))

function onClick() {
  telemetry('tab-click', {
    tab: props.tab.name,
    tabPosition: props.target,
  })

  if ('onClick' in props.tab && props.tab.onClick)
    props.tab.onClick()
  else if (props.target === 'side')
    splitScreenView.value = props.tab.name
}
</script>

<template>
  <VTooltip :disabled="!minimized" placement="right" :class="{ 'w-full': !minimized }">
    <component
      :is="target === 'main' ? NuxtLink : 'button'"
      :to="tabPath"
      :flex="`~ items-center ${minimized ? 'justify-center' : 'justify-between'}`"
      hover="bg-active"
      relative block h-10
      :w="minimized ? '10' : 'full'" select-none
      :rounded="minimized ? 'xl' : ''"
      :p="minimized ? '1' : 'x3'" text-secondary
      exact-active-class="!text-primary bg-active"
      @click="onClick"
    >
      <div flex="~ items-center gap-3">
        <TabIcon
          text-xl
          :icon="tab.icon"
          title="Settings"
          :show-title="false"
        />
        <span v-if="!minimized" overflow-hidden text-ellipsis ws-nowrap>
          {{ tab.title }}
        </span>
      </div>
      <div
        v-if="badge"
        h-4 w-4 rounded-full text-9px text-white flex="~ items-center justify-center"
        :class="[isActive ? 'bg-primary' : 'bg-gray', { 'absolute bottom-0 right-0': minimized }]"
      >
        <span translate-y-0.5px>{{ toValue(badge) }}</span>
      </div>
    </component>
    <template #popper>
      <div>
        {{ tab.title }}
      </div>
      <div v-if="'extraTabVNode' in tab && tab.extraTabVNode" hidden lg:block>
        <Component :is="tab.extraTabVNode" />
      </div>
    </template>
  </VTooltip>
</template>
