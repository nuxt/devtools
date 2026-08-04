import type { MarkdownExit } from 'markdown-exit'
import { shallowRef } from 'vue'

const md = shallowRef<MarkdownExit>()

let promise: Promise<void> | undefined

function init() {
  if (promise)
    return

  promise = (async () => {
    const { createMarkdownExit } = await import('markdown-exit')
    md.value = createMarkdownExit({
      html: true,
      linkify: true,
      breaks: true,
    })
  })()
}

export function renderMarkdown(string: string) {
  init()
  if (!md.value)
    return string
  return md.value.render(string)
}
