import type { Nuxt } from '@nuxt/schema'
import { expect, it, vi } from 'vitest'

const loadOnboarding = vi.hoisted(() => vi.fn())

vi.mock('@devframes/hub-ui-onboard', () => {
  loadOnboarding()
  return {
    createOnboarding: vi.fn(),
  }
})

vi.mock('@nuxt/kit', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@nuxt/kit')>()
  return {
    ...actual,
    tryResolveModule: vi.fn(async () => undefined),
  }
})

it('does not load @devframes/hub-ui-onboard outside dev', async () => {
  const { default: onboard } = await import('../src/module')
  await onboard({}, {
    options: {
      dev: false,
      devtools: {},
      modules: [],
    },
  } as unknown as Nuxt)
  expect(loadOnboarding).not.toHaveBeenCalled()
})
