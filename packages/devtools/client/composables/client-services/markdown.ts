import type MarkdownIt from 'markdown-it'

const md = ref<MarkdownIt>()

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
