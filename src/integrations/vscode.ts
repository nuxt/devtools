import { logger } from '@nuxt/kit'
import { execa } from 'execa'
import type { Nuxt } from '@nuxt/schema'
import { getPort } from 'get-port-please'
import which from 'which'
import waitOn from 'wait-on'
import type { ServerFunctions } from '../types'

export async function setup(nuxt: Nuxt, _functions: ServerFunctions) {
  const installed = !!await which('code-server').catch(() => null)

  let port = 8814
  let url = `http://localhost:${port}`
  let loaded = false
  let promise: Promise<void> | null = null

  async function start() {
    port = await getPort({ port })
    url = `http://localhost:${port}/?folder=${encodeURIComponent(nuxt.options.rootDir)}`

    logger.info(`Starting VS Code Server at ${URL} ...`)
    const command = execa('code-server', [
      'serve-local',
      '--accept-server-license-terms',
      '--without-connection-token',
      `--port=${port}`,
    ])

    nuxt.hook('close', () => {
      command.kill()
    })

    await waitOn({
      resources: [url],
      timeout: 20_000,
      reverse: true,
    })

    await new Promise(resolve => setTimeout(resolve, 2000))
    loaded = true
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
            description: 'It seems you don\'t have code-server installed.\n\nLearn more about it with <a href="https://code.visualstudio.com/docs/remote/vscode-server" target="_blank">this guide</a>.\nOnce installed, restart Nuxt and visit this tab again.',
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
}
