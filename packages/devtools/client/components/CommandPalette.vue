<script setup lang="ts">
import Fuse from 'fuse.js'

const show = ref(false)
const search = ref('')

const items = useCommands()

const fuse = computed(() => new Fuse(items.value, {
  keys: [
    'title',
  ],
  threshold: 0.3,
}))

const filtered = computed(() => {
  const result = search.value
    ? fuse.value.search(search.value).map(i => i.item)
    : (items.value || [])
  return result
})

const elements = ref<any[]>([])
const selectedIndex = ref(0)

watch(search, () => {
  selectedIndex.value = 0
})

function moveSelected(delta: number) {
  selectedIndex.value = ((selectedIndex.value + delta) + filtered.value.length) % filtered.value.length

  const item = elements.value[selectedIndex.value]
  item.scrollIntoView({
    block: 'center',
  })
}

useEventListener('keydown', (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
    e.preventDefault()
    show.value = !show.value
    return
  }

  if (show.value) {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault()
      moveSelected(e.key === 'ArrowDown' ? 1 : -1)
    }

    if (e.key === 'Enter') {
      const item = filtered.value[selectedIndex.value]
      if (item) {
        e.preventDefault()
        item.action()
        show.value = false
      }
    }

    if (e.key === 'Escape')
      show.value = false
  }
})
</script>

<template>
  <NDialog v-model="show" relative h-md w-xl of-hidden>
    <div h-full flex="~ col">
      <header border="b base" flex-none>
        <NTextInput
          v-model="search"
          placeholder="Type to search..."
          class="rounded-none py3 px2! ring-0!" n="lg green borderless"
        />
      </header>
      <div flex-auto of-auto p2 flex="~ col">
        <button
          v-for="item, idx of filtered"
          :id="item.id"
          ref="elements"
          :key="item.id"
          @click="item.action(), show = false"
          @mouseover="selectedIndex = idx"
        >
          <div
            flex="~ items-center justify-between" rounded px3 py2
            :class="selectedIndex === idx ? 'op100 bg-primary/10 text-primary saturate-100 bg-active' : 'op50'"
          >
            <span flex items-center gap2>
              <TabIcon text-xl :icon="item.icon" :title="item.title" />
              {{ item.title }}
            </span>
            <NIcon v-if="selectedIndex === idx" icon="tabler-arrow-back" />
          </div>
        </button>
        <div v-if="!filtered.length" h-full flex items-center justify-center gap-2 text-xl>
          <NIcon op50 icon="carbon-search" />
          <div>
            <span op50>No results for</span>
            <strong text-primary>
              "{{ search }}"
            </strong>
          </div>
        </div>
      </div>
      <footer border="t base" flex="~ none justify-between items-center gap-4" pointer-events-none px4 py2>
        <div text-xs flex="~ items-center gap2">
          <NButton n="xs" px1>
            <NIcon icon="tabler-arrow-back" />
          </NButton>
          <span op75>to select</span>
        </div>
        <div text-xs flex="~ items-center gap2">
          <NButton n="xs" px1>
            <NIcon icon="carbon-arrow-down" />
          </NButton>
          <NButton n="xs" px1>
            <NIcon icon="carbon-arrow-up" />
          </NButton>
          <span op75>to navigate</span>
        </div>
        <div text-xs flex="~ items-center gap2">
          <NButton n="xs" px1>
            Esc
          </NButton>
          <span op75>to close</span>
        </div>
      </footer>
    </div>
  </NDialog>
</template>
