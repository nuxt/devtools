import type { NuxtDevtoolsServerContext } from '../types'
import { existsSync } from 'node:fs'
import fs from 'node:fs/promises'
import { hostname } from 'node:os'
import { resolve } from 'node:path'
import { startSubprocess } from '@nuxt/devtools-kit'
import { logger } from '@nuxt/kit'
import { execa } from 'execa'
import { checkPort, getPort } from 'get-port-please'
import which from 'which'
import { LOG_PREFIX } from '../logger'

type CodeServerType = 'vscode' | 'code-server'
type CodeServerOptions = {
  codeBinary: string
  launchArg: string
  licenseTermsArg: string
  connectionTokenArg: string
}

export async function setup({ nuxt, options, openInEditorHooks, rpc }: NuxtDevtoolsServerContext) {
  let installed = true;
  let codeServer: CodeServerType = 'vscode'
  let alternateCodeServer: CodeServerType = 'code-server'
  const codeBinaryOptions: Record<CodeServerType, CodeServerOptions> = {
    'vscode': {
      codeBinary: 'code',
      launchArg: 'serve-web',
      licenseTermsArg: '--accept-server-license-terms',
      connectionTokenArg: '--without-connection-token'
    },
    'code-server': {
      codeBinary: 'code-server',
      launchArg: 'serve-local',
      licenseTermsArg: '',
      connectionTokenArg: ''
    }
  }
  
  if (!await which(codeBinaryOptions[codeServer].codeBinary).catch(() => null)) {
    codeServer = alternateCodeServer
    if (!await which(codeBinaryOptions[codeServer].codeBinary).catch(() => null)) {
      installed = false
    }
  }

  let { codeBinary, launchArg, licenseTermsArg, connectionTokenArg } = codeBinaryOptions[codeServer];

  const vsOptions = options?.vscode || {}

  let port = vsOptions?.port || 3080
  let url = `http://localhost:${port}`
  let loaded = false
  let promise: Promise<void> | null = null
  const mode = vsOptions?.mode || 'local-serve'
  const computerHostName = vsOptions.tunnel?.name || hostname().split('.').join('')
  const root = nuxt.options.rootDir
  const vscodeServerControllerFile = resolve(root, '.vscode', '.server-controller-port.log')

  openInEditorHooks.push(async (file) => {
    if (!existsSync(vscodeServerControllerFile))
      return false

    // With vscode-server-controller,
    // we can open files in VS Code Server
    try {
      const { port } = JSON.parse(await fs.readFile(vscodeServerControllerFile, 'utf-8')) as any
      const url = `http://localhost:${port}/open?path=${encodeURIComponent(root + '/' + file)}`
      await fetch(url)
      rpc.broadcast.navigateTo('/modules/custom-builtin-vscode')
      return true
    }
    catch (e) {
      // eslint-disable-next-line no-console
      console.debug(`Failed to open file "${file}" in VS Code Server`)
      // eslint-disable-next-line no-console
      console.debug(e)
      return false
    }
  })

  async function startCodeServer() {
    if (existsSync(vscodeServerControllerFile))
      await fs.rm(vscodeServerControllerFile, { force: true })

    if (vsOptions?.reuseExistingServer && !(await checkPort(port))) {
      loaded = true
      url = `http://localhost:${port}/?folder=${encodeURIComponent(root)}`
      logger.info(LOG_PREFIX, `Existing VS Code Server found at port ${port}...`)
      return
    }

    port = await getPort({ port })
    url = `http://localhost:${port}/?folder=${encodeURIComponent(root)}`

    logger.info(LOG_PREFIX, `Starting VS Code Server at ${url} ...`)

    // Install VS Code Server Controller
    // https://github.com/antfu/vscode-server-controller
    execa(codeBinary, [
      launchArg,
      licenseTermsArg,
      '--install-extension',
      'antfu.vscode-server-controller',
      '--host=0.0.0.0'
    ], { stderr: 'inherit', stdout: 'ignore', reject: false })

    startSubprocess(
      {
        command: codeBinary,
        args: [
          launchArg,
          licenseTermsArg,
          connectionTokenArg,
          `--port=${port}`,
          '--host=0.0.0.0'
        ],
      },
      {
        id: 'devtools:vscode',
        name: 'VS Code Server',
        icon: 'logos-visual-studio-code',
      },
      nuxt,
    )

    for (let i = 0; i < 100; i++) {
      if (await fetch(url).then(r => r.ok).catch(() => false))
        break
      await new Promise(resolve => setTimeout(resolve, 500))
    }

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

    for (let i = 0; i < 100; i++) {
      if (await fetch(url).then(r => r.ok).catch(() => false))
        break
      await new Promise(resolve => setTimeout(resolve, 500))
    }

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
      icon: 'bxl-visual-studio',
      category: 'modules',
      requireAuth: true,
      view: !installed && !(vsOptions?.mode === 'tunnel') 
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
