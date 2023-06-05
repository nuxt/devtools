import { existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import fs from 'node:fs/promises'
import { join } from 'node:path'
import fg from 'fast-glob'
import matter from 'gray-matter'

// @ts-expect-error missing types
import tiged from 'tiged'

const dir = fileURLToPath(new URL('../clones/nuxt', import.meta.url))

// clone nuxt/nuxt repo and get the docs
if (!existsSync(dir))
  await tiged('nuxt/nuxt').clone(dir)

const files = await fg(['docs/**/*.md'], {
  ignore: [
    '**/README.md',
    '**/**index.md',
    'docs/4.examples/**',
    'docs/5.community/**',
    'docs/6.bridge/**',
    'docs/7.migration/**',
  ],
  cwd: dir,
  onlyFiles: true,
}).then(r => r.sort())

const headerMatch = /^#+(.*)$/
function getTitleMarkdown(text: string) {
  const lines = text.split('\n')
  const noEmptyLines = lines.filter((line) => {
    return line.length > 0
  })
  if (noEmptyLines.length === 0)
    throw new Error('no content')

  const firstLine = noEmptyLines[0]
  const match = firstLine.match(headerMatch)
  if (match == null)
    return

  const title = match && match[1]
  return title.trim()
}

const manifest = await Promise.all(files.map(async (file) => {
  const filepath = join(dir, file)
  const { data, content } = matter(await fs.readFile(filepath, 'utf-8'))
  const path = file.replace(/\/\d+\./g, '/').replace(/\.md$/, '').replace(/\/index$/, '').replace(/^docs/, '')
  const id = `doc${path.replace(/\//g, ':')}`
  const title = (data.title || getTitleMarkdown(content) || '').trim().replace(/`/g, '').replace(/\s/g, ' ')
  if (!title)
    return
  return {
    id,
    title,
    description: data.description?.replace(/\s/g, ' '),
    url: `https://nuxt.com/docs${path}`,
  }
})).then(r => r.filter(Boolean))

await fs.writeFile(fileURLToPath(new URL('../packages/devtools/client/data/nuxt-docs.json', import.meta.url)), JSON.stringify(manifest, null, 2))
