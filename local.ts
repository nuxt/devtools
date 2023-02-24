/**
 * Local developement module entry
 *
 * Change `@nuxt/devtools` to the absolute path of this module in any of your Nuxt projects,
 * allows you to try Nuxt Devtools locally directly from the source code. HMR is supported
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
import { execa } from 'execa'
import { resolve } from 'pathe'
import { getPort } from 'get-port-please'
import { searchForWorkspaceRoot } from 'vite'
import { ROUTE_CLIENT, defaultOptions } from './packages/devtools/src/constant'
import type { ModuleOptions } from './packages/devtools/src/types'
import { packageDir } from './packages/devtools/src/dirs'
import { enableModule } from './packages/devtools/src/module-main'

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

    // TODO: add embedded terminal and forward logs to it
    const subprocess = execa('npx', ['nuxi', 'dev', '--port', PORT.toString()], { cwd: clientDir, stdio: 'pipe' })
    subprocess.stderr?.pipe(process.stderr)

    nuxt.hook('vite:extendConfig', (config) => {
      config.server ||= {}
      // add proxy to client
      config.server.proxy ||= {}
      config.server.proxy[ROUTE_CLIENT] = {
        target: `http://localhost:${PORT}`,
        changeOrigin: true,
        followRedirects: true,
      }
      // add fs allow for local modules
      config.server.fs ||= {}
      config.server.fs.allow ||= [
        searchForWorkspaceRoot(process.cwd()),
      ]
      config.server.fs.allow.push(workspaceRoot)
    })

    logger.info(`Nuxt Devtools is using local client from \`${clientDir}\``)

    return enableModule(options, nuxt)
  },
})
