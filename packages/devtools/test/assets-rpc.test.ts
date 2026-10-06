import type { NuxtDevtoolsServerContext } from '../src/types'
import fsp from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { createHooks } from 'hookable'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { collisionFreePath, setupAssetsRPC } from '../src/server-rpc/assets'

let root: string
let publicDir: string
let rpc: ReturnType<typeof setupAssetsRPC>

beforeEach(async () => {
  root = await fsp.mkdtemp(join(tmpdir(), 'nuxt-devtools-assets-'))
  publicDir = join(root, 'public')
  await fsp.mkdir(publicDir)
  await fsp.writeFile(join(publicDir, 'notes.txt'), 'x'.repeat(20_000))
  await fsp.writeFile(join(root, 'secret.txt'), 'top secret')

  const hooks = createHooks()
  rpc = setupAssetsRPC({
    nuxt: {
      hook: hooks.hook.bind(hooks),
      options: { srcDir: root, dir: { public: 'public' }, _layers: [], app: { baseURL: '/' } },
    },
    refresh: () => {},
    options: {},
  } as unknown as NuxtDevtoolsServerContext)
})

afterEach(() => fsp.rm(root, { recursive: true, force: true }))

describe('assets RPC path containment', () => {
  it('refuses to read, delete or rename anything outside the public directories', async () => {
    const secret = join(root, 'secret.txt')
    const sibling = join(root, 'publicX', 'a.txt')

    await expect(rpc.getTextAssetContent(secret)).rejects.toThrow(/outside of the public directory/)
    await expect(rpc.getImageMeta(secret)).rejects.toThrow(/outside of the public directory/)
    await expect(rpc.getTextAssetContent(join(publicDir, '..', 'secret.txt'))).rejects.toThrow()
    await expect(rpc.getTextAssetContent(sibling)).rejects.toThrow()
    await expect(rpc.deleteStaticAsset(secret)).rejects.toThrow(/outside of the public directory/)
    await expect(rpc.renameStaticAsset(join(publicDir, 'notes.txt'), secret)).rejects.toThrow(/outside of the public directory/)

    expect(await fsp.readFile(secret, 'utf-8')).toBe('top secret')
  })

  it('serves files inside public and caps the text preview', async () => {
    const content = await rpc.getTextAssetContent(join(publicDir, 'notes.txt'), 1_000_000)
    expect(content).toHaveLength(10_000)
  })
})

describe('collisionFreePath', () => {
  const existing = (present: string[]) => async (p: string) => present.includes(p)

  it('keeps the extension intact when suffixing', async () => {
    expect(await collisionFreePath('/p/logo.png', existing(['/p/logo.png']))).toBe('/p/logo-1.png')
    expect(await collisionFreePath('/p/logo.png', existing(['/p/logo.png', '/p/logo-1.png']))).toBe('/p/logo-2.png')
    expect(await collisionFreePath('/p/LICENSE', existing(['/p/LICENSE']))).toBe('/p/LICENSE-1')
    expect(await collisionFreePath('/p/logo.png', existing([]))).toBe('/p/logo.png')
  })
})
