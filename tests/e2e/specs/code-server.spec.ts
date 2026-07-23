import process from 'node:process'
import { expect, test } from '../fixtures/devtools'

const CODE_SERVER_DOCK_ID = 'devframes_plugin_code-server'
const CODE_SERVER_STATUS_RPC = 'devframes:plugin:code-server:status'

test('mounts Code Server in the Nuxt group and reports a missing binary without starting it', async ({ page, openDevTools, mode, playground }) => {
  test.skip(mode !== 'dev' || playground !== 'empty', 'missing-binary fixture runs only in empty:dev')

  await page.goto('/')
  await openDevTools()

  await page.waitForFunction((id) => {
    const ctx = (globalThis as any).__VITE_DEVTOOLS_CLIENT_CONTEXT__
    return ctx?.docks?.entries?.some((entry: any) => entry.id === id)
  }, CODE_SERVER_DOCK_ID, { timeout: 30_000 })

  const entry = await page.evaluate((id) => {
    const ctx = (globalThis as any).__VITE_DEVTOOLS_CLIENT_CONTEXT__
    return ctx.docks.entries.find((candidate: any) => candidate.id === id)
  }, CODE_SERVER_DOCK_ID)
  expect(entry).toMatchObject({
    id: CODE_SERVER_DOCK_ID,
    type: 'iframe',
    groupId: 'nuxt',
    category: 'framework',
    defaultOrder: -200,
  })

  const status = await page.evaluate(async (rpcName) => {
    const ctx = (globalThis as any).__VITE_DEVTOOLS_CLIENT_CONTEXT__
    return ctx.rpc.call(rpcName)
  }, CODE_SERVER_STATUS_RPC)
  expect(status).toMatchObject({
    detection: {
      checked: true,
      installed: false,
      bin: 'nuxt-devtools-e2e-missing-code-server',
      backend: 'code-server',
      mode: 'local',
    },
    server: { status: 'stopped' },
  })

  await page.evaluate(async (id) => {
    const ctx = (globalThis as any).__VITE_DEVTOOLS_CLIENT_CONTEXT__
    await ctx.docks.switchEntry(id)
  }, CODE_SERVER_DOCK_ID)
  const codeServerFrame = page.frameLocator(`iframe[src*="${CODE_SERVER_DOCK_ID}"]`)
  await expect(codeServerFrame.getByRole('heading', { name: 'No editor found' }))
    .toBeVisible({ timeout: 30_000 })

  // Opening the member performs detection only; it must not start a process.
  const statusAfterOpen = await page.evaluate(async (rpcName) => {
    const ctx = (globalThis as any).__VITE_DEVTOOLS_CLIENT_CONTEXT__
    return ctx.rpc.call(rpcName)
  }, CODE_SERVER_STATUS_RPC)
  expect((statusAfterOpen as any).server.status).toBe('stopped')
})

test('launches an installed Code Server with authenticated iframe handoff', async ({ page, openDevTools, mode, playground }) => {
  test.skip(
    process.env.NUXT_DEVTOOLS_E2E_CODE_SERVER !== '1' || mode !== 'dev' || playground !== 'spa',
    'opt-in installed-binary check runs only in spa:dev',
  )

  await page.goto('/')
  await openDevTools()
  await page.waitForFunction((id) => {
    const ctx = (globalThis as any).__VITE_DEVTOOLS_CLIENT_CONTEXT__
    return ctx?.docks?.entries?.some((entry: any) => entry.id === id)
  }, CODE_SERVER_DOCK_ID, { timeout: 30_000 })

  const initialStatus = await page.evaluate(async (rpcName) => {
    const ctx = (globalThis as any).__VITE_DEVTOOLS_CLIENT_CONTEXT__
    return ctx.rpc.call(rpcName)
  }, CODE_SERVER_STATUS_RPC)
  expect(initialStatus).toMatchObject({
    detection: { checked: true, installed: true, backend: 'code-server' },
    server: { status: 'stopped' },
  })

  await page.evaluate(async (id) => {
    const ctx = (globalThis as any).__VITE_DEVTOOLS_CLIENT_CONTEXT__
    await ctx.docks.switchEntry(id)
  }, CODE_SERVER_DOCK_ID)
  const launcher = page.frameLocator(`iframe[src*="${CODE_SERVER_DOCK_ID}"]`)
  await launcher.getByRole('button', { name: 'Launch editor' }).click()

  await expect.poll(async () => {
    return page.evaluate(async (rpcName) => {
      const ctx = (globalThis as any).__VITE_DEVTOOLS_CLIENT_CONTEXT__
      return ctx.rpc.call(rpcName)
    }, CODE_SERVER_STATUS_RPC)
  }, { timeout: 60_000 }).toMatchObject({
    server: { status: 'running' },
    connect: { cookie: { name: 'code-server-session' } },
  })

  const runningStatus = await page.evaluate(async (rpcName) => {
    const ctx = (globalThis as any).__VITE_DEVTOOLS_CLIENT_CONTEXT__
    return ctx.rpc.call(rpcName)
  }, CODE_SERVER_STATUS_RPC) as any
  const serverPort = String(runningStatus.server.port)

  // Authentication succeeded when the nested editor frame reaches the VS Code
  // workbench rather than code-server's /login page.
  await expect.poll(async () => {
    const editorFrame = page.frames().find((frame) => {
      try {
        return new URL(frame.url()).port === serverPort
      }
      catch {
        return false
      }
    })
    if (!editorFrame)
      return { workbench: 0, pathname: '' }
    return {
      workbench: await editorFrame.locator('.monaco-workbench').count(),
      pathname: new URL(editorFrame.url()).pathname,
    }
  }, { timeout: 60_000 }).toEqual({ workbench: 1, pathname: '/' })
})
