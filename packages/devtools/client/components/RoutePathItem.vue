<script setup lang="ts">
import type { RouteInfo } from '~~/../src/types'
import { computed, ref } from 'vue'

const props = defineProps<{
  route: RouteInfo
}>()
const emit = defineEmits<{
  (e: 'navigate', path: string): void
}>()
const EXPRESS_PARAM_RE = /(:\w+[?*]?(?:\(\))?)/
const TRAILING_PARENS_RE = /\(\)$/
const MULTI_SLASH_RE = /\/+/g

const partsInput = ref<string[]>([])
const parts = computed(() => {
  const _ = parseExpressRoute(props.route.path)
  // eslint-disable-next-line vue/no-side-effects-in-computed-properties
  partsInput.value = Array.from<string>({ length: _.length }).fill('')
  return _
})

function parseExpressRoute(route: string) {
  return route
    .split(EXPRESS_PARAM_RE)
    .filter(Boolean)
    .map(i => i[0] === ':'
      ? i.replace(TRAILING_PARENS_RE, '?')
      : i)
}

const path = computed(() => parts.value
  .map(
    (i, idx) => i[0] === ':'
      ? partsInput.value[idx]
      : i,
  )
  .join('')
  .replace(MULTI_SLASH_RE, '/'))
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
            <div flex="~" items-center p2 text-sm font-mono>
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
          <NButton type="submit" block n="primary">
            Navigate
          </NButton>
        </form>
      </div>
    </template>
  </VDropdown>
</template>
