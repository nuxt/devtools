import type { Nuxt } from 'nuxt/schema'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { resolveSetupMode } from '../src/utils/setup-mode'
import { fakeNuxt } from './fake-nuxt'

const loadModuleMain = vi.fn()
const enableModule = vi.fn()

beforeEach(() => {
  vi.resetModules()
  vi.doMock('../src/module-main', () => {
    loadModuleMain()
    return { enableModule }
  })
  vi.stubEnv('VITEST', '')
  vi.stubEnv('TEST', '')
  vi.stubEnv('NODE_ENV', 'production')
})

afterEach(() => {
  vi.unstubAllEnvs()
  loadModuleMain.mockReset()
  enableModule.mockReset()
})

function nuxtWith(options: Partial<Nuxt['options']>) {
  const nuxt = fakeNuxt()
  Object.assign(nuxt.options, options)
  return nuxt
}

async function setupDevtools(options: Partial<Nuxt['options']>) {
  const { default: devtools } = await import('../src/module')
  await devtools({ enabled: true }, nuxtWith(options))
}

const productionBuild = {
  analyze: { enabled: false },
} as Nuxt['options']['build']
const analyzeBuild = {
  analyze: { enabled: true },
} as Nuxt['options']['build']

describe('resolveSetupMode', () => {
  it('resolves the setup mode', () => {
    expect(resolveSetupMode(nuxtWith({ dev: true }))).toBe('dev')
    expect(resolveSetupMode(nuxtWith({ dev: false, build: productionBuild }))).toBeUndefined()
    expect(resolveSetupMode(nuxtWith({ dev: false, build: analyzeBuild }))).toBe('analyze-build')
    expect(resolveSetupMode(nuxtWith({ dev: false, builder: '@nuxt/webpack-builder' }))).toBe('unsupported-builder')
    expect(resolveSetupMode(nuxtWith({ dev: true, builder: '@nuxt/webpack-builder' }))).toBe('unsupported-builder')
    expect(resolveSetupMode(nuxtWith({ dev: true, test: true }))).toBeUndefined()
  })
})

describe('module entry', () => {
  it('loads module-main in dev', async () => {
    await setupDevtools({ dev: true })
    expect(loadModuleMain).toHaveBeenCalledOnce()
    expect(enableModule).toHaveBeenCalledOnce()
  })

  it('does not load module-main in a production build', async () => {
    await setupDevtools({ dev: false, build: productionBuild })
    expect(loadModuleMain).not.toHaveBeenCalled()
  })

  it('loads module-main in a production build with build.analyze enabled', async () => {
    await setupDevtools({ dev: false, build: analyzeBuild })
    expect(enableModule).toHaveBeenCalledOnce()
  })

  it('loads module-main in a production build with an unsupported builder', async () => {
    await setupDevtools({ dev: false, builder: '@nuxt/webpack-builder' })
    expect(enableModule).toHaveBeenCalledOnce()
  })

  it('does not load module-main when nuxt.options.test is set', async () => {
    await setupDevtools({ dev: true, test: true })
    expect(loadModuleMain).not.toHaveBeenCalled()
  })
})
