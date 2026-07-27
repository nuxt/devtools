import process from 'node:process'
import { expect, test } from '../fixtures/devtools'

const CODE_SERVER_DOCK_ID = 'devframes_plugin_code-server'
const CODE_SERVER_STATUS_RPC = 'devframes:plugin:code-server:status'

test('reports a missing editor binary without starting a process', async ({ page, openDevTools, mode, playground }) => {
  // `empty`'s config points Code Server at a deliberately missing binary
  // (`NUXT_DEVTOOLS_CODE_SERVER_BIN`), so detection is deterministic everywhere.
  test.skip(mode !== 'dev' || playground !== 'empty', 'missing-binary fixture runs only in empty:dev')

  await page.goto('/')
  await openDevTools()

  await page.waitForFunction((id) => {
    const ctx = (globalThis as any).__VITE_DEVTOOLS_CLIENT_CONTEXT__
    return ctx?.docks?.entries?.some((entry: any) => entry.id === id)
  }, CODE_SERVER_DOCK_ID, { timeout: 30_000 })

  // Open the Code Server member the way a user would.
  await page.evaluate(async (id) => {
    const ctx = (globalThis as any).__VITE_DEVTOOLS_CLIENT_CONTEXT__
    await ctx.docks.switchEntry(id)
  }, CODE_SERVER_DOCK_ID)

  // The user sees the "no editor" empty state (the binary can't be found).
  const codeServerFrame = page.frameLocator(`iframe[src*="${CODE_SERVER_DOCK_ID}"]`)
  await expect(codeServerFrame.getByRole('heading', { name: 'No editor found' }))
    .toBeVisible({ timeout: 30_000 })

  // Opening the member performs detection only — it must not launch a process.
  const status = await page.evaluate(async (rpcName) => {
    const ctx = (globalThis as any).__VITE_DEVTOOLS_CLIENT_CONTEXT__
    return ctx.rpc.call(rpcName)
  }, CODE_SERVER_STATUS_RPC)
  expect((status as any).server.status).toBe('stopped')
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
