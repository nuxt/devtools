import type { Nuxt } from 'nuxt/schema'
import type { NuxtDevtoolsServerContext } from '../src/types'
import fsp from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { createHooks } from 'hookable'
import { join, normalize } from 'pathe'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { setupGeneralRPC } from '../src/server-rpc/general'
import { getOptions } from '../src/server-rpc/options'

vi.mock('launch-editor', () => ({
  default: vi.fn(),
}))

vi.mock('../src/server-rpc/options', () => ({
  getOptions: vi.fn(),
}))

const TOKEN = 'token'

function fakeContext(root: string, handledByHook = true) {
  const hooks = createHooks()
  const opened: string[] = []
  const ctx = {
    nuxt: {
      options: {
        rootDir: join(root, 'docs'),
        workspaceDir: root,
      },
      hooks,
      hook: hooks.hook.bind(hooks),
    } as unknown as Nuxt,
    options: {},
    refresh: () => {},
    ensureDevAuthToken: async () => {},
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
    await fsp.mkdir(join(root, 'docs/app/components'), { recursive: true })
    await fsp.mkdir(join(root, 'src/components/button'), { recursive: true })
    await fsp.writeFile(join(root, 'docs/app/components/DocPage.vue'), '<template><div /></template>')
    await fsp.writeFile(join(root, 'src/components/button/Button.demo.vue'), '<template><div /></template>')
    vi.spyOn(process, 'cwd').mockReturnValue(join(root, 'docs'))
    vi.mocked(getOptions).mockReset()
  })

  afterEach(async () => {
    vi.restoreAllMocks()
    await fsp.rm(root, { recursive: true, force: true })
  })

  it('opens a path relative to the current working directory', async () => {
    const { ctx, opened } = fakeContext(root)
    const { openInEditor } = setupGeneralRPC(ctx)

    await expect(openInEditor(TOKEN, 'app/components/DocPage.vue')).resolves.toBe(true)
    expect(opened).toEqual([
      join(root, 'docs/app/components/DocPage.vue'),
    ])
  })

  it('opens a path relative to the root directory when the cwd holds no such file', async () => {
    vi.spyOn(process, 'cwd').mockReturnValue(join(root, 'tools'))
    const { ctx, opened } = fakeContext(root)
    const { openInEditor } = setupGeneralRPC(ctx)

    await expect(openInEditor(TOKEN, 'app/components/DocPage.vue')).resolves.toBe(true)
    expect(opened).toEqual([
      join(root, 'docs/app/components/DocPage.vue'),
    ])
  })

  it('opens a workspace-relative path while the cwd is the package directory', async () => {
    const { ctx, opened } = fakeContext(root)
    const { openInEditor } = setupGeneralRPC(ctx)

    await expect(openInEditor(TOKEN, 'docs/app/components/DocPage.vue:3:5')).resolves.toBe(true)
    expect(opened).toEqual([`${join(root, 'docs/app/components/DocPage.vue')}:3:5`])
  })

  it('opens a file that lives at the workspace root, outside the Nuxt package', async () => {
    const { ctx, opened } = fakeContext(root)
    const { openInEditor } = setupGeneralRPC(ctx)

    await expect(openInEditor(TOKEN, 'src/components/button/Button.demo.vue:27:2')).resolves.toBe(true)
    expect(opened).toEqual([`${join(root, 'src/components/button/Button.demo.vue')}:27:2`])
  })

  it('opens an absolute path without touching the base directories', async () => {
    const { ctx, opened } = fakeContext(root)
    const { openInEditor } = setupGeneralRPC(ctx)
    const filepath = join(root, 'docs/app/components/DocPage.vue')

    await expect(openInEditor(TOKEN, filepath)).resolves.toBe(true)
    expect(opened).toEqual([filepath])
  })

  it('reports the cwd candidate when the file exists under none of the bases', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {})
    const { ctx, opened } = fakeContext(root)
    const { openInEditor } = setupGeneralRPC(ctx)

    await expect(openInEditor(TOKEN, 'app/components/Missing.vue')).resolves.toBe(false)
    expect(opened).toEqual([])
    expect(error).toHaveBeenCalledWith('File not found:', join(root, 'docs/app/components/Missing.vue'))
  })
})
