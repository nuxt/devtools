import type { NuxtDevtoolsServerContext } from '../src/types'
import { mkdtemp } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'pathe'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { getIconifySvg, setIconifySvgLoader } from '../../devtools-ui-kit/src/composables/iconify'
import { setupIconsRPC } from '../src/server-rpc/icons'

// No DOM in the test env; sanitizing is DOMPurify's job, not under test here.
vi.mock('dompurify', () => ({
  default: {
    sanitize: (svg: string) => svg,
  },
}))

async function iconsRPC() {
  // An empty project: icons must come from the collections shipped with DevTools.
  const rootDir = await mkdtemp(join(tmpdir(), 'ndt-icons-'))
  return setupIconsRPC({
    nuxt: {
      options: { rootDir },
    },
  } as unknown as NuxtDevtoolsServerContext)
}

describe('icons', () => {
  afterEach(() => {
    setIconifySvgLoader(undefined)
    vi.unstubAllGlobals()
  })

  it('resolves icons from local collections on the server', async () => {
    const { getIconSvg } = await iconsRPC()
    const svg = await getIconSvg('carbon', 'settings')
    expect(svg).toMatch(/^<svg /)
    expect(svg).toContain('width="1.2em"')
    expect(await getIconSvg('carbon', 'not-an-icon')).toBeUndefined()
    expect(await getIconSvg('not-a-collection', 'foo')).toBeUndefined()
  })

  it('resolves client icons through the loader, never over the network', async () => {
    const fetch = vi.fn()
    vi.stubGlobal('fetch', fetch)
    const { getIconSvg } = await iconsRPC()
    setIconifySvgLoader(getIconSvg)

    for (const id of ['carbon:settings', 'carbon-settings', 'i-carbon-tree-view-alt'])
      expect(await getIconifySvg(id)).toMatch(/^<svg /)
    expect(await getIconifySvg('carbon-not-an-icon')).toBeUndefined()
    expect(fetch).not.toHaveBeenCalled()
  })

  it('falls back to the class when no loader is set', async () => {
    const fetch = vi.fn()
    vi.stubGlobal('fetch', fetch)
    expect(await getIconifySvg('carbon:settings')).toBeUndefined()
    expect(fetch).not.toHaveBeenCalled()
  })
})
