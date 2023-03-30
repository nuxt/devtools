import { join } from 'node:path'
import { resolve } from 'pathe'
import fg from 'fast-glob'
import type { NuxtDevtoolsServerContext, ServerFunctions } from '../types'

export function setupServerRoutesRPC({ nuxt }: NuxtDevtoolsServerContext) {
  return {
    async getServerRouets(exclude: string[] = []) {
      const dir = resolve(nuxt.options.serverDir)
      const baseURL = nuxt.options.app.baseURL
      const methods = ['get', 'head', 'post', 'put', 'delete', 'connect', 'options', 'trace', 'patch']

      const files = await fg(['**/*', ...exclude?.map(e => `!**/${e}`)], {
        cwd: dir,
        onlyFiles: true,
      })
      return await Promise.all(files.map(async (path) => {
        const filePath = resolve(dir, path)
        let method = 'get'
        methods.forEach((m) => {
          if (path.includes(m))
            method = m
        })

        const type = path.split('/')[0]

        const url = path
          .replace(`.${method}`, '')
          .replace(/\.[^/.]+$/, '')
          .replace(/\/index$/, '')

        const params = url.match(/\[(.*?)\]/g)?.map(p => p.replace('[', '').replace(']', '')) || []

        return {
          type,
          url: `/${url}`,
          params,
          baseURL: join(baseURL, url),
          method,
          path,
          filePath,
        }
      }))
    },
  } satisfies Partial<ServerFunctions>
}
