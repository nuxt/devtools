<script setup lang="ts">
import { NuxtLink } from '#components'
import type { ModuleBuiltinTab, ModuleCustomTab } from '~/../src/types'

const props = withDefaults(
  defineProps<{
    tab: ModuleCustomTab | ModuleBuiltinTab
    target?: 'main' | 'side'
  }>(),
  {
    target: 'main',
  },
)

const route = useRoute()

const badge = computed(() => 'badge' in props.tab && props.tab.badge?.())

const tabPath = computed(() => 'path' in props.tab ? props.tab.path! : `/modules/custom-${props.tab.name}`)
const isActive = computed(() => route.path.startsWith(tabPath.value))

function onClick() {
  if ('onClick' in props.tab && props.tab.onClick)
    props.tab.onClick()
  else if (props.target === 'side')
    splitScreenView.value = props.tab.name
}
</script>

<template>
  <VTooltip placement="right">
    <component
      :is="target === 'main' ? NuxtLink : 'button'"
      :to="tabPath"
      flex="~"
      hover="bg-active" relative
      h-10 w-10 select-none items-center justify-center rounded-xl p1 text-secondary
      exact-active-class="!text-primary bg-active"
      @click="onClick"
    >
      <TabIcon
        text-xl
        :icon="tab.icon" :title="tab.title" :show-title="false"
      />
      <div
        v-if="badge" absolute bottom-0 right-0 h-4 w-4 rounded-full text-9px text-white flex="~ items-center justify-center"
        :class="isActive ? 'bg-primary' : 'bg-gray'"
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
