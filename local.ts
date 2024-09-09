/**
 * Local development module entry
 *
 * Change `@nuxt/devtools` to the absolute path of this module in any of your Nuxt projects,
 * allows you to try Nuxt DevTools locally directly from the source code. HMR is supported
 * for the front-end client.
 *
 * For example, if you clone this repo to `/users/me/nuxt-devtools`, update your nuxt config:
 *
 * ```diff
 * // nuxt.config.ts
 * export default defineNuxtConfig({
 *   modules: [
 * -   '@nuxt/devtools',
 * +   '/users/me/nuxt-devtools/local',
 *   ]
 * })
 * ```
 */
import { defineNuxtModule, logger } from '@nuxt/kit'
import { getPort } from 'get-port-please'
import { resolve } from 'pathe'
import { searchForWorkspaceRoot } from 'vite'
import { defaultOptions } from './packages/devtools/src/constant'
import { packageDir } from './packages/devtools/src/dirs'
import { enableModule } from './packages/devtools/src/module-main'
import { startSubprocess } from './packages/devtools-kit/src/index'
import type { ModuleOptions } from './packages/devtools/src/types'

export type { ModuleOptions }

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: '@nuxt/devtools',
    configKey: 'devtools',
  },
  defaults: defaultOptions,
  async setup(options, nuxt) {
    const clientDir = resolve(packageDir, 'client')
    const workspaceRoot = resolve(packageDir, '../..')
    const PORT = await getPort({ port: 12442 })

    nuxt.hook('vite:extendConfig', (config) => {
      config.server ||= {}
      // add proxy to client
      config.server.proxy ||= {}
      // TODO: ws proxy is not working
      config.server.proxy['/__nuxt_devtools__/client'] = {
        target: `http://localhost:${PORT}`,
        changeOrigin: true,
        followRedirects: true,
        ws: true,
      }
      // add fs allow for local modules
      config.server.fs ||= {}
      config.server.fs.allow ||= [
        searchForWorkspaceRoot(process.cwd()),
      ]
      config.server.fs.allow.push(workspaceRoot)
    })

    nuxt.hook('app:resolve', () => {
      startSubprocess(
        {
          command: 'npx',
          args: ['nuxi', 'dev'],
          cwd: clientDir,
          stdio: 'pipe',
          env: {
            NUXT_DEVTOOLS_LOCAL: 'true',
            PORT: PORT.toString(),
          },
        },
        {
          id: 'devtools:local',
          name: 'Nuxt DevTools Local',
          icon: 'logos-nuxt-icon',
        },
        nuxt,
      )
    })

    logger.info(`Nuxt DevTools is using local client from \`${clientDir}\` at port \`${PORT}\``)

    return enableModule(options, nuxt)
  },
})
