<script setup lang="ts">
import type { NuxtDevToolsInspectorProps } from './Props'
import { onClickOutside, useDraggable } from '@vueuse/core'
import { computed, nextTick, ref, useTemplateRef, watch } from 'vue'

defineOptions({
  inheritAttrs: false,
})
const { props } = defineProps<{ props: NuxtDevToolsInspectorProps }>()
const emit = defineEmits<{
  (e: 'close'): void
  (e: 'selectParent'): void
  (e: 'openInEditor', file: string): void
}>()

const PANEL_WIDTH = 400
const PANEL_HEIGHT = 300
const PANEL_MARGIN = 30

const showToast = ref(false)
const toastContent = ref('')
let toastTimer: ReturnType<typeof setTimeout> | undefined

const initX = ref(0)
const initY = ref(0)

watch(
  () => [props.matched, props.mouse] as const,
  ([matched, mouse]) => {
    if (!matched || !mouse)
      return
    initX.value = Math.max(PANEL_MARGIN, Math.min(mouse.x, window.innerWidth - PANEL_WIDTH - PANEL_MARGIN))
    initY.value = Math.max(PANEL_MARGIN, Math.min(mouse.y, window.innerHeight - PANEL_HEIGHT - PANEL_MARGIN))
  },
)

const el = useTemplateRef<HTMLElement>('el')
const draggingEl = useTemplateRef<HTMLElement>('draggingEl')

const { x, y, style, isDragging } = useDraggable(el, {
  initialValue: {
    x: initX.value,
    y: initY.value,
  },
  handle: draggingEl,
})

watch([initX, initY], () => {
  if (!props.matched)
    return
  x.value = initX.value
  y.value = initY.value
})

const hasMoved = computed(() => x.value !== initX.value || y.value !== initY.value)

onClickOutside(el, () => {
  nextTick(() => {
    if (!props.matched)
      return
    if (hasMoved.value)
      return
    close()
  })
})

function close() {
  emit('close')
}

async function selectParent() {
  emit('selectParent')
}

async function openInEditor() {
  if (!props.matched)
    return
  const file = `${props.matched.pos[0]}:${props.matched.pos[1]}:${props.matched.pos[2]}`
  // await fetch(`/api/open-in-editor?file=${encodeURI(file)}`)
  emit('openInEditor', file)
  // close()
}

function generateUniqueSelector(element: Element | undefined): string {
  if (!element)
    return ''

  const path: string[] = []
  let current: Element | null = element

  while (current && current !== document.body) {
    let selector = current.tagName.toLowerCase()

    // Add ID if available
    if (current.id) {
      selector += `#${CSS.escape(current.id)}`
      path.unshift(selector)
      break // ID is unique, no need to go further
    }

    // Add classes
    if (current.className && typeof current.className === 'string') {
      const classes = current.className.trim().split(/\s+/).filter(Boolean)
      if (classes.length > 0)
        selector += `.${classes.map(c => CSS.escape(c)).join('.')}`
    }

    // Add nth-child if there are siblings of the same type
    const parent = current.parentElement
    if (parent) {
      const siblings = Array.from(parent.children).filter(
        child => child.tagName === current!.tagName,
      )
      if (siblings.length > 1) {
        const index = siblings.indexOf(current) + 1
        selector += `:nth-of-type(${index})`
      }
    }

    path.unshift(selector)
    current = current.parentElement
  }

  if (path.length > 6)
    return ''

  return path.join(' > ')
}

function buildComponentTree(): string {
  if (!props.matched)
    return ''

  const components: string[] = []
  let current: typeof props.matched | undefined = props.matched

  // Build the tree by walking up the parent chain
  while (current) {
    // Try to get component name from vnode
    let componentName = 'Unknown'
    if (current.vnode) {
      const vnode = current.vnode
      if (vnode.type) {
        if (typeof vnode.type === 'string') {
          componentName = vnode.type
        }
        else if (typeof vnode.type === 'object') {
          const typeObj = vnode.type as any
          componentName = typeObj.name || typeObj.__name || typeObj.__file?.split('/').pop()?.replace(/\.\w+$/, '') || 'AnonymousComponent'
        }
        else if (typeof vnode.type === 'function') {
          componentName = (vnode.type as any).name || 'FunctionalComponent'
        }
      }
    }

    components.unshift(componentName)

    // Move to parent
    try {
      current = current.getParent()
    }
    catch {
      break
    }
  }

  return components.join(' > ')
}

async function copyAgentInfo() {
  if (!props.matched)
    return

  try {
    // Gather browser context
    const pageUrl = window.location.href
    const viewport = `${window.innerWidth}x${window.innerHeight}`
    const selectedText = window.getSelection()?.toString()?.trim()

    // Extract element information
    const filepath = props.matched.pos[0]
    const line = props.matched.pos[1]
    const column = props.matched.pos[2]
    const fileLocation = `${filepath}:${line}:${column}`

    // Generate CSS selector
    const selector = generateUniqueSelector(props.matched.el)

    // Build component tree
    const componentTree = buildComponentTree()

    // Format the output
    const info = [
      `Page URL: ${pageUrl}`,
      `Viewport: ${viewport}`,
      selectedText ? `Selected Text: ${selectedText}` : null,
      selector ? `Selector: ${selector}` : null,
      componentTree ? `Component Tree: ${componentTree}` : null,
      `File: ${fileLocation}`,
    ].filter(Boolean).join('\n')

    // Copy to clipboard
    await navigator.clipboard.writeText(info)

    // Show toast with preview
    toastContent.value = info
    showToast.value = true

    if (toastTimer)
      clearTimeout(toastTimer)
    // Hide toast after 6 seconds
    toastTimer = setTimeout(() => {
      showToast.value = false
    }, 6_000)
  }
  catch (error) {
    console.error('Failed to copy agent info:', error)
  }
}
</script>

<template>
  <div
    v-if="props.matched"
    ref="el"
    class="fixed relative z-9999999 w-400px flex flex-col of-hidden rounded-lg bg-glass text-sm color-base shadow-lg ring-1 ring-base backdrop-blur duration-200"
    :style="style"
    :class="[
      isDragging ? 'transition-none' : 'transition-opacity',
      props.matched ? 'op100' : 'op0 pointer-events-none',
    ]"
    v-bind="$attrs"
  >
    <!-- <div
      class="pointer-events-none absolute inset-0 z-10 transition-opacity duration-300"
    >
      <div class="nuxt-devtools-inspect-running-border pointer-events-none absolute inset-0 z-10 border-1.5 border-transparent rounded-lg" />
    </div> -->
    <div ref="draggingEl" class="flex flex-col gap-2 of-hidden p2">
      <div class="flex items-center gap-2">
        <button
          v-if="props.hasParent"
          title="Go to parent"
          class="flex items-center border-1 border-base rounded px1 py0.5 text-sm font-mono op50 disabled:pointer-events-none hover:text-green6 hover:op100 disabled:op10!"
          @click="selectParent"
        >
          <div class="i-ph-arrow-bend-left-up-duotone text-lg" />
          Parent
        </button>
        <button
          title="Open in editor"
          class="flex items-center border-1 border-base rounded px1 py0.5 text-sm font-mono op50 hover:text-green6 hover:op100"
          @click="openInEditor"
        >
          <div class="i-ph-arrow-up-right-light text-lg" />
          Open
        </button>
        <button
          title="Copy infos for agents"
          class="flex items-center border-1 border-base rounded px1 py0.5 text-sm font-mono op50 hover:text-green6 hover:op100"
          @click="copyAgentInfo"
        >
          <div class="i-ph-copy-duotone text-lg" />
          Info
        </button>
        <div class="flex-auto" />
        <button
          title="Close"
          class="flex-none op50 hover:op100"
          @click="close"
        >
          <div class="i-ph-x text-lg" />
        </button>
      </div>
      <div class="grid grid-cols-[max-content_1fr] items-center gap-2">
        <!-- File -->
        <div class="i-ph-file-duotone flex-none text-lg op50" title="File" />
        <span class="break-all text-xs font-mono" title="File location">{{ props.matched.pos[0] }}:{{ props.matched.pos[1] }}:{{ props.matched.pos[2] }}</span>

        <!-- Component Tree -->
        <div class="i-ph-tree-view-duotone flex-none text-lg op50" title="Component Tree" />
        <span class="break-all text-xs font-mono" title="Component Tree">{{ buildComponentTree() }}</span>
      </div>
    </div>
  </div>

  <!-- Toast notification -->
  <div
    v-show="showToast"
    class="fixed bottom-20px right-20px z-99999999 max-w-500px flex flex-col gap-2 rounded-lg bg-glass p4 text-sm color-base shadow-xl ring-1 ring-base backdrop-blur transition-all duration-300"
    :class="showToast ? 'translate-y-0 op100' : 'translate-y-10 op0'"
  >
    <div class="flex items-center gap-2">
      <div class="i-ph-check-circle-duotone text-xl text-green6" />
      <span class="font-semibold">Infos for agents copied to clipboard</span>
    </div>
    <pre class="mt-2 max-h-200px of-auto whitespace-pre-wrap rounded bg-black bg-op-20 p2 text-xs font-mono">{{ toastContent }}</pre>
  </div>
</template>
