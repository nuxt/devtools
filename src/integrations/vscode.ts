import { logger } from '@nuxt/kit'
import { execa } from 'execa'
import type { Nuxt } from '@nuxt/schema'
import { getPort } from 'get-port-please'
import which from 'which'
import waitOn from 'wait-on'
import type { ServerFunctions } from '../types'

export async function setup(nuxt: Nuxt, _functions: ServerFunctions) {
  const url = await which('code-server').catch(() => null)
  if (!url) {
    logger.debug('VS Code Server is not installed, module is disabled.')
    return
  }

  const PORT = await getPort({ port: 8814 })
  const URL = `http://localhost:${PORT}/?folder=${encodeURIComponent(nuxt.options.rootDir)}`
  let loaded = false
  let promise: Promise<void> | null = null

  async function start() {
    logger.info(`Starting VS Code Server at ${URL} ...`)
    const command = execa('code-server', [
      'serve-local',
      '--accept-server-license-terms',
      '--without-connection-token',
      `--port=${PORT}`,
    ])

    nuxt.hook('close', () => {
      command.kill()
    })

    await waitOn({
      resources: [URL],
      timeout: 20_000,
      reverse: true,
    })

    await new Promise(resolve => setTimeout(resolve, 2000))
    loaded = true
  }

  nuxt.hook('devtools:customTabs', (tabs) => {
    tabs.push({
      name: 'vscode',
      title: 'VS Code',
      icon: 'i-bxl-visual-studio',
      view: loaded
        ? {
            type: 'iframe',
            src: URL,
          }
        : {
            type: 'launch',
            description: 'Start VS Code Server',
            actions: [{
              label: promise ? 'Starting...' : 'Launch',
              pending: !!promise,
              handle: () => {
                promise = promise || start()
                return promise
              },
            }],
          },
    })
  })
}
