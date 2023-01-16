import { logger } from '@nuxt/kit'
import { execa } from 'execa'
import type { Nuxt } from '@nuxt/schema'
import { getPort } from 'get-port-please'
import which from 'which'

export async function setupVSCodeServer(nuxt: Nuxt) {
  const url = await which('code-server').catch(() => null)
  if (!url) {
    logger.debug('VS Code Server is not installed, module is disabled.')
    return
  }

  const PORT = await getPort({ port: 8814 })

  logger.info(`Starting VS Code Server at http://localhost:${PORT} ...`)
  const command = execa('code-server', [
    'serve-local',
    '--accept-server-license-terms',
    '--without-connection-token',
    `--port=${PORT}`,
  ])

  nuxt.hook('close', () => {
    command.kill()
  })

  nuxt.hook('devtools:customTabs', (iframeTabs) => {
    iframeTabs.push({
      name: 'vscode',
      title: 'VS Code',
      icon: 'i-bxl-visual-studio',
      builtin: true,
      view: {
        type: 'iframe',
        src: `http://localhost:${PORT}/?folder=${encodeURIComponent(nuxt.options.rootDir)}`,
      },
    })
  })
}
