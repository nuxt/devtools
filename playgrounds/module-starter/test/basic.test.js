import { fileURLToPath } from 'node:url'
import { $fetch, setup } from '@nuxt/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { setupDevToolsUI } from '../src/devtools'

describe('ssr', async () => {
  await setup({
    rootDir: fileURLToPath(new URL('./fixtures/basic', import.meta.url)),
  })

  it('renders the index page', async () => {
    // Get response to a server-rendered page with `$fetch`.
    const html = await $fetch('/')
    expect(html).toContain('<div>basic</div>')
  })
})

it('keeps module custom tab contribution contract', () => {
  const hooks = new Map()
  const nuxt = {
    hook: vi.fn((name, fn) => hooks.set(name, fn)),
  }
  const resolver = {
    resolve: vi.fn((path = '.') => fileURLToPath(new URL(path, import.meta.url))),
  }

  setupDevToolsUI(nuxt, resolver)

  const tabs = []
  hooks.get('devtools:customTabs')?.(tabs)

  expect(tabs).toContainEqual({
    name: 'my-module',
    title: 'My Module',
    icon: 'carbon:apps',
    view: {
      type: 'iframe',
      src: '/__my-module',
    },
  })
})
