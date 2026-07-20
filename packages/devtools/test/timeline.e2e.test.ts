import { fileURLToPath } from 'node:url'
import { $fetch, setup } from '@nuxt/test-utils/e2e'
import { describe, expect, it } from 'vitest'

describe('timeline function wrapping', { timeout: 60_000 }, async () => {
  await setup({
    rootDir: fileURLToPath(new URL('./fixtures/timeline', import.meta.url)),
    dev: true,
  })

  it('does not break key injection of keyed composables', async () => {
    const html = await $fetch<string>('/')
    expect(html).toContain('counter: 1')
  })

  it('applies both key injection and wrapping to the module', async () => {
    const mod = await $fetch<string>('/_nuxt/app.vue')
    expect(mod).toContain('__nuxtTimelineWrap("useState", _$__useState)')
    expect(mod).toContain('__nuxtTimelineWrap("callOnce", _$__callOnce)')
    expect(mod).toContain('/* nuxt-injected */')
  })
})
