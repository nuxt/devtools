import type { Nitro } from 'nitropack'
import { join, resolve } from 'pathe'
import fg from 'fast-glob'
import { withBase, withLeadingSlash, withoutTrailingSlash } from 'ufo'
import { debounce } from 'perfect-debounce'
import type { NuxtDevtoolsServerContext, ServerFunctions, ServerRouteInfo } from '../types'

export function setupServerRoutesRPC({ nuxt, refresh }: NuxtDevtoolsServerContext) {
  let nitro: Nitro

  let promiseCache: Promise<ServerRouteInfo[]> | null = null

  const refreshDebounced = debounce(() => {
    promiseCache = null
    refresh('getServerRoutes')
  }, 500)

  nuxt.hook('nitro:init', (_) => {
    nitro = _
    promiseCache = null
    refresh('getServerRoutes')
  })

  nuxt.hook('ready', () => {
    nitro?.storage.watch((event, key) => {
      if (key.startsWith('src:api:'))
        refreshDebounced()
    })
  })

  function scan() {
    if (promiseCache)
      return promiseCache

    promiseCache = (async () => {
      if (!nitro)
        return []
      const files = await Promise.all([
        scanServerDir(nitro, 'api', scanFileHandler('api')),
        scanServerDir(nitro, 'routes', scanFileHandler('route')),
      ]).then(r => r.flat())
      return files
    })()

    return promiseCache
  }

  return {
    async getServerRoutes() {
      return scan()
    },
  } satisfies Partial<ServerFunctions>
}

/**
 * Ported from Nitropack:
 * https://github.com/unjs/nitro/blob/ea5ea881a7bfa74def754d0a7120be4bc5b3ba7d/src/scan.ts
 */

interface FileInfo {
  dir: string
  path: string
  fullPath: string
}

const GLOB_SCAN_PATTERN = '**/*.{ts,mjs,js,cjs}'
const httpMethodRegex = /\.(connect|delete|get|head|options|patch|post|put|trace)/

function scanFileHandler(type: ServerRouteInfo['type'], prefix = '/') {
  return (file: FileInfo): ServerRouteInfo => {
    let route = file.path
      .replace(/\.[A-Za-z]+$/, '')
      .replace(/\[\.{3}]/g, '**')
      .replace(/\[\.{3}(\w+)]/g, '**:$1')
      .replace(/\[(\w+)]/g, ':$1')
    route = withLeadingSlash(withoutTrailingSlash(withBase(route, prefix)))

    let method
    const methodMatch = route.match(httpMethodRegex)
    if (methodMatch) {
      route = route.slice(0, Math.max(0, methodMatch.index!))
      method = methodMatch[1]
    }

    route = route.replace(/\/index$/, '') || '/'

    if (type === 'api')
      route = `/api${route}`

    return {
      filepath: file.fullPath,
      path: file.path,
      route,
      type,
      method,
    }
  }
}

async function scanServerDir(
  nitro: Nitro,
  name: string,
  mapper: (file: FileInfo) => ServerRouteInfo,
): Promise<ServerRouteInfo[]> {
  const dirs = nitro.options.scanDirs.map(dir => join(dir, name))
  const files = await scanDirs(dirs)
  return files.map(f => mapper(f))
}

function scanDirs(dirs: string[]): Promise<FileInfo[]> {
  return Promise.all(
    dirs.map(async (dir) => {
      const fileNames = await fg(GLOB_SCAN_PATTERN, {
        cwd: dir,
        dot: true,
      })
      return fileNames
        .map((fileName) => {
          return {
            dir,
            path: fileName,
            fullPath: resolve(dir, fileName),
          }
        })
        .sort((a, b) => a.path.localeCompare(b.path))
    }),
  ).then(r => r.flat())
}
