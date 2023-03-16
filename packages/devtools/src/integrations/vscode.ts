import { hostname } from 'node:os'
import { logger } from '@nuxt/kit'
import { execa } from 'execa'
import { checkPort, getPort } from 'get-port-please'
import which from 'which'
import waitOn from 'wait-on'
import { startSubprocess } from '@nuxt/devtools-kit'
import { LOG_PREFIX } from '../logger'
import type { NuxtDevtoolsServerContext } from '../types'

export async function setup({ nuxt, options }: NuxtDevtoolsServerContext) {
  const installed = !!await which('code-server').catch(() => null)

  const vsOptions = options?.vscode || {}

  let port = vsOptions?.port || 3080
  let url = `http://localhost:${port}`
  let loaded = false
  let promise: Promise<void> | null = null
  const mode = vsOptions?.mode || 'local-serve'
  const computerHostName = vsOptions.tunnel?.name || hostname().split('.').join('')

  async function startCodeServer() {
    if (vsOptions?.reuseExistingServer && !(await checkPort(port))) {
      loaded = true
      url = `http://localhost:${port}/?folder=${encodeURIComponent(nuxt.options.rootDir)}`
      logger.info(LOG_PREFIX, `Existing VS Code Server found at port ${port}...`)
      return
    }

    port = await getPort({ port })
    url = `http://localhost:${port}/?folder=${encodeURIComponent(nuxt.options.rootDir)}`

    logger.info(LOG_PREFIX, `Starting VS Code Server at ${url} ...`)

    startSubprocess(
      {
        command: 'code-server',
        args: [
          'serve-local',
          '--accept-server-license-terms',
          '--without-connection-token',
          `--port=${port}`,
        ],
      },
      {
        id: 'devtools:vscode',
        name: 'VS Code Server',
        icon: 'logos-visual-studio-code',
      },
      nuxt,
    )

    await waitOn({
      resources: [url],
      timeout: 20_000,
      reverse: true,
    })

    await new Promise(resolve => setTimeout(resolve, 2000))
    loaded = true
  }

  async function startCodeTunnel() {
    const { stdout: currentDir } = await execa('pwd')

    url = `https://vscode.dev/tunnel/${computerHostName}${currentDir}`

    logger.info(LOG_PREFIX, `Starting VS Code tunnel at ${url} ...`)

    const command = execa('code', [
      'tunnel',
      '--accept-server-license-terms',
      '--name',
      `${computerHostName}`,
    ])

    command.stderr?.pipe(process.stderr)
    command.stdout?.pipe(process.stdout)

    nuxt.hook('close', () => {
      command.kill()
    })

    await waitOn({
      resources: [url],
      timeout: 20_000,
    })

    await new Promise(resolve => setTimeout(resolve, 2000))
    loaded = true
  }

  async function start() {
    if (mode === 'tunnel')
      await startCodeTunnel()
    else
      await startCodeServer()
  }

  nuxt.hook('devtools:customTabs', (tabs) => {
    tabs.push({
      name: 'builtin-vscode',
      title: 'VS Code',
      icon: 'i-bxl-visual-studio',
      view: !installed
        ? {
            type: 'launch',
            title: 'Install VS Code Server',
            description: 'It seems you don\'t have code-server installed.\n\nLearn more about it with <a href="https://code.visualstudio.com/blogs/2022/07/07/vscode-server" target="_blank">this guide</a>.\nOnce installed, restart Nuxt and visit this tab again.',
            actions: [],
          }
        : !loaded
            ? {
                type: 'launch',
                description: 'Launch VS Code right in the devtools!',
                actions: [{
                  label: promise ? 'Starting...' : 'Launch',
                  pending: !!promise,
                  handle: () => {
                    promise = promise || start()
                    return promise
                  },
                }],
              }
            : {
                type: 'iframe',
                src: url,
              },
    })
  })

  if (vsOptions?.startOnBoot)
    promise = promise || start()
}
