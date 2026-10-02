import type { Nuxt } from 'nuxt/schema'
import type { NuxtDevtoolsServerContext } from '../src/types'
import fsp from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { createHooks } from 'hookable'
import { join, normalize } from 'pathe'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { setupGeneralRPC } from '../src/server-rpc/general'

function fakeContext(root: string) {
  const hooks = createHooks()
  const opened: string[] = []
  const ctx = {
    nuxt: {
      options: {
        rootDir: join(root, 'apps/web'),
        workspaceDir: root,
      },
      hooks,
      hook: hooks.hook.bind(hooks),
    } as unknown as Nuxt,
    options: {},
    refresh: () => {},
    openInEditorHooks: [(filepath: string) => {
      opened.push(filepath)
      return true
    }],
  } as unknown as NuxtDevtoolsServerContext
  return { ctx, opened }
}

describe('openInEditor', () => {
  let root: string

  beforeEach(async () => {
    root = normalize(await fsp.mkdtemp(join(tmpdir(), 'devtools-editor-')))
    await fsp.mkdir(join(root, 'apps/web/app/components'), { recursive: true })
    await fsp.writeFile(join(root, 'apps/web/app/components/Foo.vue'), '<template><div /></template>')
    vi.spyOn(process, 'cwd').mockReturnValue(join(root, 'apps/web'))
  })

  afterEach(async () => {
    vi.restoreAllMocks()
    await fsp.rm(root, { recursive: true, force: true })
  })

  it('opens a path relative to the current working directory', async () => {
    const { ctx, opened } = fakeContext(root)
    const { openInEditor } = setupGeneralRPC(ctx)

    await expect(openInEditor('app/components/Foo.vue')).resolves.toBe(true)
    expect(opened).toEqual([join(root, 'apps/web/app/components/Foo.vue')])
  })

  it('opens a path relative to the root directory when the cwd holds no such file', async () => {
    vi.spyOn(process, 'cwd').mockReturnValue(join(root, 'tools'))
    const { ctx, opened } = fakeContext(root)
    const { openInEditor } = setupGeneralRPC(ctx)

    await expect(openInEditor('app/components/Foo.vue')).resolves.toBe(true)
    expect(opened).toEqual([join(root, 'apps/web/app/components/Foo.vue')])
  })

  it('opens a workspace-relative path while the cwd is the package directory', async () => {
    const { ctx, opened } = fakeContext(root)
    const { openInEditor } = setupGeneralRPC(ctx)

    await expect(openInEditor('apps/web/app/components/Foo.vue:3:5')).resolves.toBe(true)
    expect(opened).toEqual([`${join(root, 'apps/web/app/components/Foo.vue')}:3:5`])
  })

  it('opens an absolute path without touching the base directories', async () => {
    const { ctx, opened } = fakeContext(root)
    const { openInEditor } = setupGeneralRPC(ctx)
    const filepath = join(root, 'apps/web/app/components/Foo.vue')

    await expect(openInEditor(filepath)).resolves.toBe(true)
    expect(opened).toEqual([filepath])
  })

  it('reports a path that exists under none of the base directories', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {})
    const { ctx, opened } = fakeContext(root)
    const { openInEditor } = setupGeneralRPC(ctx)

    await expect(openInEditor('app/components/Bar.vue')).resolves.toBe(false)
    expect(opened).toEqual([])
    expect(error).toHaveBeenCalledWith('File not found:', join(root, 'apps/web/app/components/Bar.vue'))
  })
})
