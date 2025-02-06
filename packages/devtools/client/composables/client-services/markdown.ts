import type MarkdownIt from 'markdown-it'
import { shallowRef } from 'vue'

const md = shallowRef<MarkdownIt>()

let promise: Promise<void> | undefined

function init() {
  if (promise)
    return

  promise = (async () => {
    const { default: MarkdownIt } = await import('markdown-it')
    md.value = new MarkdownIt({
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
