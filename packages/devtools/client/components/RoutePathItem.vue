<script setup lang="ts">
import type { RouteInfo } from '~~/../src/types'

const props = defineProps<{
  route: RouteInfo
}>()

const emit = defineEmits<{
  (e: 'navigate', path: string): void
}>()

const partsInput = ref<string[]>([])
const parts = computed(() => {
  const _ = parseExpressRoute(props.route.path)
  partsInput.value = Array.from({ length: _.length }, () => '')
  return _
})

const path = computed(() => parts.value.map((i, idx) => i[0] === ':' ? partsInput.value[idx] : i).join('').replace(/\/+/g, '/'))
const hasWildcard = computed(() => props.route.path.includes(':'))

function navigate() {
  emit('navigate', path.value)
}
</script>

<template>
  <button v-if="!hasWildcard" @click="navigate">
    <code>{{ route.path }}</code>
  </button>
  <VDropdown v-else>
    <code block cursor-pointer>
      <span
        v-for="part, idx of parts" :key="idx"
        :class="part[0] === ':' ? 'text-gray border border-dashed rounded border-gray:50 px1' : ''"
      >
        {{ part[0] === ':' ? part.slice(1) : part }}
      </span>
    </code>
    <template #popper="{ hide }">
      <div p2>
        <form flex="~ col" @submit.prevent="() => { navigate(); hide() }">
          <template v-if="hasWildcard">
            <div px2 text-sm op50>
              Fill params and navigate:
            </div>
            <div flex="~" items-center font-mono p2 text-sm>
              <template v-for="part, idx of parts" :key="idx">
                <NTextInput
                  v-if="part[0] === ':'"
                  v-model="partsInput[idx]"
                  w-20 n-sm
                  :placeholder="part.slice(1)"
                />
                <span v-else>{{ part }}</span>
              </template>
            </div>
          </template>
          <NButton block n="primary">
            Navigate
          </NButton>
        </form>
      </div>
    </template>
  </VDropdown>
</template>
