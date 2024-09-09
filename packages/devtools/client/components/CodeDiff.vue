<script setup lang="ts">
import { unrefElement } from '@vueuse/core'
import { diffLines } from 'diff'
import type { BuiltinLanguage } from 'shiki'

const props = defineProps<{
  from: string
  to: string
  lang: BuiltinLanguage | 'text'
}>()

function calculateDiff(from: string, to: string) {
  const diffs = diffLines(from.trim(), to.trim())

  const added: number[] = []
  const removed: number[] = []
  const result = []

  for (const diff of diffs) {
    const lines = diff.value.trimEnd().split('\n')
    for (const line of lines) {
      if (diff.added) {
        added.push(result.length)
        result.push(line)
      }
      else if (diff.removed) {
        removed.push(result.length)
        result.push(line)
      }
      else {
        result.push(line)
      }
    }
  }

  return {
    added,
    removed,
    result: result.join('\n'),
  }
}

const diff = computed(() => calculateDiff(props.from, props.to))

function transformRendered(code: string) {
  let count = 0
  return code
    .replace(/class="shiki/, 'class="shiki diff')
    .replace(/class="line"/g, (_) => {
      count++
      if (diff.value.added.includes(count - 1))
        return 'class="line line-added"'
      if (diff.value.removed.includes(count - 1))
        return 'class="line line-removed"'
      return _
    })
}

const elRef = ref<HTMLDivElement>()
onMounted(scrollTo)

function scrollTo() {
  const el = unrefElement(elRef)
  if (el)
    el.querySelector('.line-added,.line-removed')?.scrollIntoView()
}
</script>

<template>
  <NCodeBlock
    ref="elRef"
    :code="diff.result"
    :lang="lang"
    :transform-rendered="transformRendered"
    @loaded="scrollTo"
  />
</template>
