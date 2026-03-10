import { afterEach, describe, expect, it, vi } from 'vitest'
import { NUXT_DOCK_ID } from '../../../integrations/vite-devtools'
import { closeNuxtDock, findNuxtDockIframe, getViteDocksContext, isNuxtDockSelected, openNuxtDock, toggleNuxtDock, waitForViteDocksContext } from './vite-dock'

describe('vite dock adapter', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('opens and toggles Nuxt dock via context methods', async () => {
    const docks = {
      selectedId: null as string | null,
      switchEntry: vi.fn(async (id?: string | null) => {
        docks.selectedId = id ?? null
        return true
      }),
      toggleEntry: vi.fn(async (id: string) => {
        docks.selectedId = docks.selectedId === id ? null : id
        return true
      }),
    }

    await openNuxtDock(docks)
    expect(docks.switchEntry).toHaveBeenCalledWith(NUXT_DOCK_ID)
    expect(isNuxtDockSelected(docks)).toBe(true)

    await toggleNuxtDock(docks)
    expect(docks.toggleEntry).toHaveBeenCalledWith(NUXT_DOCK_ID)
    expect(isNuxtDockSelected(docks)).toBe(false)
  })

  it('closes only when Nuxt dock is selected', async () => {
    const docks = {
      selectedId: 'other:dock',
      switchEntry: vi.fn(async () => true),
      toggleEntry: vi.fn(async () => true),
    }

    await closeNuxtDock(docks)
    expect(docks.switchEntry).not.toHaveBeenCalled()

    docks.selectedId = NUXT_DOCK_ID
    await closeNuxtDock(docks)
    expect(docks.switchEntry).toHaveBeenCalledWith(null)
  })

  it('reads dock context from embedded element', async () => {
    const docks = {
      selectedId: null as string | null,
      switchEntry: vi.fn(async () => true),
      toggleEntry: vi.fn(async () => true),
    }
    vi.stubGlobal('document', {
      querySelector: vi.fn(() => ({ context: { docks } })),
    })

    expect(getViteDocksContext()).toBe(docks)
    expect(await waitForViteDocksContext(1, 1)).toBe(docks)
  })

  it('returns undefined if dock context is unavailable', async () => {
    vi.stubGlobal('document', {
      querySelector: vi.fn(() => null),
    })
    expect(getViteDocksContext()).toBeUndefined()
    expect(await waitForViteDocksContext(1, 1)).toBeUndefined()
  })

  it('finds Nuxt dock iframe from Vite dock shadow root', () => {
    const iframe = {
      src: 'http://localhost:3000/foo/__nuxt_devtools__/client/',
    } as HTMLIFrameElement
    vi.stubGlobal('document', {
      querySelector: vi.fn(() => ({
        shadowRoot: {
          querySelectorAll: () => [iframe],
        },
      })),
    })

    expect(findNuxtDockIframe()).toBe(iframe)
  })
})
