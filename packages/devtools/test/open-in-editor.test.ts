import type { Nuxt } from 'nuxt/schema'
import type { NuxtDevtoolsServerContext } from '../src/types'
import fsp from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { launchEditor } from 'devframe/utils/launch-editor'
import { createHooks } from 'hookable'
import { join, normalize } from 'pathe'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { setupGeneralRPC } from '../src/server-rpc/general'
import { getOptions } from '../src/server-rpc/options'

vi.mock('devframe/utils/launch-editor', () => ({
  launchEditor: vi.fn(),
}))

vi.mock('../src/server-rpc/options', () => ({
  getOptions: vi.fn(),
}))

function fakeContext(root: string, handledByHook = true) {
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
    openInEditorHooks: [
      (filepath: string) => {
        opened.push(filepath)
        return handledByHook
      },
    ],
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
    vi.mocked(getOptions).mockReset()
    vi.mocked(launchEditor).mockClear()
  })

  afterEach(async () => {
    vi.restoreAllMocks()
    await fsp.rm(root, { recursive: true, force: true })
  })

  it('opens a path relative to the current working directory', async () => {
    const { ctx, opened } = fakeContext(root)
    const { openInEditor } = setupGeneralRPC(ctx)

    await expect(openInEditor('app/components/Foo.vue')).resolves.toBe(true)
    expect(opened).toEqual([
      join(root, 'apps/web/app/components/Foo.vue'),
    ])
  })

  it('opens a path relative to the root directory when the cwd holds no such file', async () => {
    vi.spyOn(process, 'cwd').mockReturnValue(join(root, 'tools'))
    const { ctx, opened } = fakeContext(root)
    const { openInEditor } = setupGeneralRPC(ctx)

    await expect(openInEditor('app/components/Foo.vue')).resolves.toBe(true)
    expect(opened).toEqual([
      join(root, 'apps/web/app/components/Foo.vue'),
    ])
  })

  it('opens a workspace-relative path while the cwd is the package directory', async () => {
    const { ctx, opened } = fakeContext(root)
    const { openInEditor } = setupGeneralRPC(ctx)

    await expect(openInEditor('apps/web/app/components/Foo.vue:3:5')).resolves.toBe(true)
    expect(opened).toEqual([`${join(root, 'apps/web/app/components/Foo.vue')}:3:5`])
  })

  it.each([':3', ':3:5', '::12:3'])('keeps the %s suffix after the file name', async (suffix) => {
    const { ctx, opened } = fakeContext(root)
    const { openInEditor } = setupGeneralRPC(ctx)

    await expect(openInEditor(`app/components/Foo.vue${suffix}`)).resolves.toBe(true)
    expect(opened).toEqual([`${join(root, 'apps/web/app/components/Foo.vue')}${suffix}`])
  })

  it('does not read a suffix that follows a line terminator', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    const { ctx, opened } = fakeContext(root)
    const { openInEditor } = setupGeneralRPC(ctx)

    await expect(openInEditor('app/components/Foo.vue\n:3')).resolves.toBe(false)
    expect(opened).toEqual([])
  })

  // A long run of colons used to cost one scan to the end of the input per
  // colon. The assertion is on growth (4x the input must not cost anywhere near
  // 16x the time) rather than on an absolute budget, so it does not depend on
  // how fast the machine is.
  it('splits the suffix of a long run of colons in linear time', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    const { ctx } = fakeContext(root)
    const { openInEditor } = setupGeneralRPC(ctx)
    const sizes = [100_000, 400_000]
    const runs = 7

    const measure = async (size: number) => {
      const input = `${':'.repeat(size)}x`
      await openInEditor(input) // warm up
      const times: number[] = []
      for (let i = 0; i < runs; i++) {
        const start = performance.now()
        await expect(openInEditor(input)).resolves.toBe(false)
        times.push(performance.now() - start)
      }
      return times.sort((a, b) => a - b)[Math.floor(runs / 2)]!
    }

    const small = await measure(sizes[0]!)
    const large = await measure(sizes[1]!)
    // linear is about 4x, quadratic about 16x
    expect(large / small).toBeLessThan(8)
  })

  it('opens an absolute path without touching the base directories', async () => {
    const { ctx, opened } = fakeContext(root)
    const { openInEditor } = setupGeneralRPC(ctx)
    const filepath = join(root, 'apps/web/app/components/Foo.vue')

    await expect(openInEditor(filepath)).resolves.toBe(true)
    expect(opened).toEqual([filepath])
  })

  it.each(['subl', 'sublime'])('opens Sublime Text with subl for the %s setting', async (setting) => {
    vi.mocked(getOptions).mockReturnValue({
      behavior: { openInEditor: setting },
    } as any)
    const { ctx, opened } = fakeContext(root, false)
    const { openInEditor } = setupGeneralRPC(ctx)
    const filepath = join(root, 'apps/web/app/components/Foo.vue')

    await expect(openInEditor('app/components/Foo.vue')).resolves.toBe(true)
    expect(opened).toEqual([filepath])
    expect(launchEditor).toHaveBeenCalledWith(filepath, 'subl')
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
