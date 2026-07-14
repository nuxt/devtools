import { describe, expect, it } from 'vitest'
import { removeNuxtModuleFromCode } from '../src/utils/nuxt-config'

const base = `export default defineNuxtConfig({\n  modules: ['@nuxt/image', '@nuxt/content'],\n})\n`

describe('removeNuxtModuleFromCode', () => {
  it('removes the requested module and keeps the others', () => {
    const out = removeNuxtModuleFromCode(base, '@nuxt/image')
    expect(out).not.toContain('@nuxt/image')
    expect(out).toContain('@nuxt/content')
  })

  it('removes the first module without dropping the last', () => {
    const out = removeNuxtModuleFromCode(base, '@nuxt/image')
    expect(out).toContain('@nuxt/content') // regression guard for the splice(-1) bug
  })

  it('removes a module declared as a tuple with options', () => {
    const src = `export default defineNuxtConfig({\n  modules: [['@nuxt/image', { quality: 80 }], '@nuxt/content'],\n})\n`
    const out = removeNuxtModuleFromCode(src, '@nuxt/image')
    expect(out).not.toContain('@nuxt/image')
    expect(out).toContain('@nuxt/content')
  })

  it('is a no-op when the module is absent', () => {
    const out = removeNuxtModuleFromCode(base, '@nuxt/not-there')
    expect(out).toContain('@nuxt/image')
    expect(out).toContain('@nuxt/content')
  })
})
