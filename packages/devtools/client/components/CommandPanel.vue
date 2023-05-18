<!-- eslint-disable no-console -->
<script setup lang="ts">
import Fuse from 'fuse.js'

const props = withDefaults(defineProps<{
  modelValue: boolean
  placeholder?: string
  items: { title: string; path: string; icon?: string }[]
  fuse?: Fuse.IFuseOptions<any>
}>(), {
  placeholder: 'Search...',
})

const emit = defineEmits<{ (...args: any): void }>()
const model = useVModel(props, 'modelValue', emit, { passive: true })

const route = useRoute()
const router = useRouter()

const search = ref('')
const input = ref<{ element: HTMLInputElement }>()

const fuse = computed(() => new Fuse(props.items || [], props.fuse || {
  keys: [
    'title',
    'path',
  ],
  threshold: 0.3,
}))

const filtered = computed(() => {
  const result = search.value
    ? fuse.value.search(search.value).map(i => i.item)
    : (props.items || [])
  return result
})

const selected = ref(filtered.value.find(i => i.path === route.path) || filtered.value[0])

watch(search, () => {
  selected.value = filtered.value[0]
})

useEventListener('keydown', (e) => {
  const isCtrlKey = e.ctrlKey || e.metaKey
  if (isCtrlKey && e.key === 'k') {
    e.preventDefault()
    model.value = !model.value
    if (model.value)
      nextTick(() => input.value?.element.focus())
  }

  if (model.value) {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (selected.value) {
        const index = filtered.value.findIndex(i => i.path === selected.value.path)
        if (index < filtered.value.length - 1) {
          // TODO: scroll to selected
          selected.value = filtered.value[index + 1]
        }
      }
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (selected.value) {
        const index = filtered.value.findIndex(i => i.path === selected.value.path)
        if (index > 0)
          selected.value = filtered.value[index - 1]
      }
    }
  }

  if (e.key === 'Enter') {
    if (selected.value) {
      e.preventDefault()
      router.push(selected.value.path)
      model.value = false
    }
  }

  if (e.key === 'Escape')
    model.value = false
})
</script>

<template>
  <NDialog v-model="model" relative h-md w-xl of-hidden>
    <header p4 border="b base">
      <NTextInput ref="input" v-model="search" icon="carbon-search" :placeholder="placeholder" class="py3" n="lg green" />
    </header>
    <div h-full of-auto px4 pb32 pt2>
      <NuxtLink v-for="item of filtered" :key="item.path" :to="item.path" @click="model = false" @mouseover="selected = item">
        <div flex="~ items-center justify-between" border="~ base" my2 rounded bg-active p4 :class="{ 'op100 bg-primary/10 text-primary saturate-100': selected.path === item.path }">
          <span flex items-center gap2>
            <NIcon v-if="item.icon" :icon="item.icon" />
            {{ item.title }}
          </span>
          <NIcon v-if="selected.path === item.path" icon="tabler-arrow-back" />
        </div>
      </NuxtLink>
      <div v-if="!filtered.length" h-full flex items-center justify-center gap-2 text-xl>
        <NIcon icon="carbon-search" />
        <div>
          No results for
          <strong text-primary>
            "{{ search }}"
          </strong>
        </div>
      </div>
    </div>
    <footer border="t base" absolute bottom-0 left-0 right-0 flex="~ justify-between items-center gap-4" px4 py2 bg-base>
      <div text-xs>
        <NButton n="xs" class="px2">
          <NIcon icon="tabler-arrow-back" />
        </NButton>
        to select
      </div>
      <div text-xs>
        <NButton n="xs" class="px2">
          <NIcon icon="carbon-arrow-down" />
        </NButton>
        <NButton n="xs" class="px2" ml1>
          <NIcon icon="carbon-arrow-up" />
        </NButton>
        to navigate
      </div>
      <div text-xs>
        <NButton n="xs" class="px2">
          Esc
        </NButton>
        to close
      </div>
    </footer>
  </NDialog>
</template>
