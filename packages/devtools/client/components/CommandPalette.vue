<script setup lang="ts">
import { useEventListener } from '@vueuse/core'
import Fuse from 'fuse.js'
import { computed, ref, watch } from 'vue'
import { useCommands } from '~/composables/state-commands'
import type { CommandItem } from '~/composables/state-commands'

const show = ref(false)
const search = ref('')

const rootItems = useCommands()
const overrideItems = ref<CommandItem[] | undefined>()
const items = computed(() => overrideItems.value || rootItems.value)

const fuse = computed(() => new Fuse(items.value, {
  keys: [
    'id',
    'title',
  ],
  distance: 50,
}))

const filtered = computed(() => search.value
  ? fuse.value.search(search.value).map(i => i.item)
  : (items.value || []))

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

async function enterItem(item: CommandItem) {
  const result = await item.action()
  if (!result) {
    overrideItems.value = undefined
    search.value = ''
    show.value = false
  }
  else {
    overrideItems.value = result
    search.value = ''
  }
}

useEventListener('keydown', (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
    e.preventDefault()
    overrideItems.value = undefined
    search.value = ''
    show.value = !show.value
    return
  }

  if (!show.value)
    return

  switch (e.key) {
    case 'ArrowDown':
    case 'ArrowUp':
      e.preventDefault()
      moveSelected(e.key === 'ArrowDown' ? 1 : -1)
      break

    case 'Enter': {
      const item = filtered.value[selectedIndex.value]
      if (item) {
        e.preventDefault()
        enterItem(item)
      }
      break
    }

    case 'Escape': {
      e.preventDefault()
      if (overrideItems.value) {
        overrideItems.value = undefined
        search.value = ''
      }
      else {
        show.value = false
      }
      break
    }
  }
})

function onKeyDown(e: KeyboardEvent) {
  if (e.key === 'Backspace' && !search.value && overrideItems.value) {
    e.preventDefault()
    overrideItems.value = undefined
    search.value = ''
  }
}
</script>

<template>
  <NDialog v-model="show" relative h-md w-xl of-hidden>
    <div h-full flex="~ col">
      <header border="b base" flex-none>
        <NTextInput
          v-model="search"
          placeholder="Type to search..."
          class="rounded-none py3 px2! ring-0!"
          n="green borderless"
          @keydown="onKeyDown"
        />
      </header>
      <div flex-auto of-auto p2 flex="~ col">
        <button
          v-for="item, idx of filtered"
          :id="item.id"
          :key="item.id"
          @click="enterItem(item)"
          @mouseover="selectedIndex = idx"
        >
          <div
            flex="~ gap-2 items-center justify-between" rounded px3 py2
            :class="selectedIndex === idx ? 'op100 bg-primary/10 text-primary saturate-100 bg-active' : 'op80'"
          >
            <TabIcon :icon="item.icon" :title="item.title" flex-none text-xl />
            <span flex flex-auto items-center gap2 of-hidden>
              <span ws-nowrap>{{ item.title }}</span>
              <span of-hidden truncate ws-nowrap text-sm op50>{{ item.description }}</span>
            </span>
            <NIcon v-if="selectedIndex === idx" icon="i-carbon-text-new-line scale-x--100" flex-none />
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
          <span op75>to {{ overrideItems ? 'go back' : 'close' }}</span>
        </div>
        <div text-xs flex="~ items-center gap2">
          <NButton n="xs" px1>
            <NIcon icon="i-carbon-text-new-line scale-x--100" />
          </NButton>
          <span op75>to select</span>
        </div>
      </footer>
    </div>
  </NDialog>
</template>
