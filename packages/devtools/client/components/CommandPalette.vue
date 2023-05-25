<script setup lang="ts">
import Fuse from 'fuse.js'

const show = ref(false)
const search = ref('')

const items = useCommands()

const groups = computed(() => ['all', ...new Set(items.value.map(i => i.id.split(':')[0]))])
const currentGroup = ref(groups.value[0])
const groupItems = computed(() => items.value.filter(i => i.id.startsWith(currentGroup.value) || currentGroup.value === 'all'))

const fuse = computed(() => new Fuse(groupItems.value, {
  keys: [
    'id',
    'title',
  ],
  distance: 50,
}))

const filtered = computed(() => {
  const result = search.value
    ? fuse.value.search(search.value).map(i => i.item)
    : (groupItems.value || [])
  return result
})

const selectedIndex = ref(0)

watch(search, () => {
  selectedIndex.value = 0
  scrollToITem()
})

function moveSelected(delta: number) {
  selectedIndex.value = ((selectedIndex.value + delta) + filtered.value.length) % filtered.value.length
  scrollToITem()
}

function scrollToITem() {
  const item = document.getElementById(filtered.value[selectedIndex.value]?.id)
  item?.scrollIntoView({
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
        <div relative>
          <NTextInput
            v-model="search"
            placeholder="Type to search..."
            class="rounded-none py3 px2! ring-0!" n="lg green borderless"
          />
          <NSelect
            v-model="currentGroup"
            absolute bottom-0 right-0 top-0
            class="rounded-none border-none op-50 ring-0!"
          >
            <option v-for="group of groups" :key="group" :value="group">
              {{ group }}
            </option>
          </NSelect>
        </div>
      </header>
      <div flex-auto of-auto p2 flex="~ col">
        <button
          v-for="item, idx of filtered"
          :id="item.id"
          :key="item.id"
          @click="item.action(), show = false"
          @mouseover="selectedIndex = idx"
        >
          <div
            flex="~ items-center justify-between" rounded px3 py2
            :class="selectedIndex === idx ? 'op100 bg-primary/10 text-primary saturate-100 bg-active' : 'op50'"
          >
            <span flex items-center gap2 capitalize>
              <TabIcon text-xl :icon="item.icon" :title="item.title" />
              {{ item.title }}
            </span>
            <span text-xs>
              {{ item.id.replace(/:[^:]+$/, '').split(':').reverse().join(' . ').replace(/-/g, ' ') }}
            </span>
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
