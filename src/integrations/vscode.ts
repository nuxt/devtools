import { logger } from '@nuxt/kit'
import { execa } from 'execa'
import type { Nuxt } from '@nuxt/schema'

export function setupVSCodeServer(nuxt: Nuxt) {
  const PORT = 8141
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
