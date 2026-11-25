import type { NuxtDevtoolsServerContext, ServerFunctions, VfsData, VfsFile } from '../types'
import type { AnyNitro } from '../utils/nitro-compat'
import { isMap } from 'node:util/types'
import { normalize } from 'pathe'
import { debounce } from 'perfect-debounce'
import { onDevReload } from '../utils/nitro-compat'

const BACKSLASH_RE = /\\/g
const TRAILING_SLASHES_RE = /\/+$/

type VfsSourceValue
  = | string
    | (() => string | Promise<string>)
    | { render: () => string | Promise<string> }

async function resolveVfsValue(value: VfsSourceValue | undefined): Promise<string | undefined> {
  if (typeof value === 'string')
    return value
  if (typeof value === 'function')
    return await value()
  if (value && typeof value === 'object' && typeof value.render === 'function')
    return await value.render()
  return undefined
}

export function setupVirtualFilesRPC({ nuxt, refresh }: NuxtDevtoolsServerContext) {
  let nitro: AnyNitro | undefined
  let unhookDevReload: (() => void) | undefined

  const refreshDebounced = debounce(() => {
    refresh('getVirtualFiles')
  }, 500)

  nuxt.hook('app:templatesGenerated', () => {
    void refreshDebounced()
  })

  nuxt.hook('nitro:init', (_nitro: AnyNitro) => {
    nitro = _nitro
    refresh('getVirtualFiles')

    unhookDevReload?.()
    unhookDevReload = onDevReload(_nitro, () => {
      void refreshDebounced()
    })
  })

  nuxt.hook('close', () => {
    unhookDevReload?.()
    unhookDevReload = undefined
  })

  function collectIds(): Set<string> {
    const ids = new Set<string>(Object.keys(nuxt.vfs ?? {}))
    if (nitro?.vfs) {
      // Check `isMap` via `node:util/types` rather than `instanceof Map`: Nuxt 5
      // wraps `nitro.vfs` in a Proxy before Nitro's build replaces it, and calling
      // Map methods on that Proxy throws an incompatible-receiver TypeError.
      if (isMap(nitro.vfs)) {
        for (const id of nitro.vfs.keys())
          ids.add(id)
      }
      else {
        for (const id of Object.keys(nitro.vfs))
          ids.add(id)
      }
    }
    const virtualOptions = (nitro?.options as { virtual?: Record<string, VfsSourceValue> } | undefined)?.virtual
    if (virtualOptions) {
      for (const id of Object.keys(virtualOptions))
        ids.add(id)
    }
    return ids
  }

  function getVirtualFiles(): VfsData {
    const rawRootDir = nitro?.options.rootDir ?? nuxt.options.rootDir ?? ''
    const rootDir = rawRootDir
      ? normalize(rawRootDir).replace(TRAILING_SLASHES_RE, '')
      : ''
    const buildDir = nuxt.options.buildDir
      ? normalize(nuxt.options.buildDir).replace(TRAILING_SLASHES_RE, '')
      : ''
    const allIds = collectIds()
    const entries: VfsData['entries'] = []

    for (const id of allIds) {
      const normalizedId = id.replace(BACKSLASH_RE, '/')
      // Nuxt writes a Windows backslash duplicate alongside the forward-slash key in `nuxt.vfs`.
      if (id !== normalizedId && allIds.has(normalizedId))
        continue

      if (buildDir && normalizedId.startsWith(`${buildDir}/`)) {
        const subpath = normalizedId.slice(buildDir.length + 1)
        // Hide raw buildDir entries when `#build/<subpath>` already represents the same template.
        if (allIds.has(`#build/${subpath}`))
          continue
      }

      if (id.startsWith('#build/') && buildDir) {
        const fullPath = `${buildDir}/${id.slice('#build/'.length)}`
        entries.push({
          id,
          path: allIds.has(fullPath)
            ? fullPath
            : id,
        })
        continue
      }

      entries.push({
        id,
        path: normalizedId,
      })
    }

    return {
      rootDir,
      entries,
    }
  }

  async function getVirtualFile(id: string): Promise<VfsFile | undefined> {
    if (!id)
      return undefined

    if (nitro?.vfs && isMap(nitro.vfs) && nitro.vfs.has(id)) {
      const content = await resolveVfsValue(nitro.vfs.get(id) as VfsSourceValue | undefined)
      if (content !== undefined)
        return { id, content }
    }

    const virtualOptions = (nitro?.options as { virtual?: Record<string, VfsSourceValue> } | undefined)?.virtual
    if (virtualOptions && Object.hasOwn(virtualOptions, id)) {
      const content = await resolveVfsValue(virtualOptions[id])
      if (content !== undefined)
        return { id, content }
    }

    if (nitro?.vfs && !isMap(nitro.vfs) && Object.hasOwn(nitro.vfs, id)) {
      const content = await resolveVfsValue((nitro.vfs as Record<string, VfsSourceValue>)[id])
      if (content !== undefined)
        return { id, content }
    }

    if (nuxt.vfs && Object.hasOwn(nuxt.vfs, id)) {
      const content = await resolveVfsValue(nuxt.vfs[id])
      if (content !== undefined)
        return { id, content }
    }

    return undefined
  }

  return {
    getVirtualFiles,
    getVirtualFile,
  } satisfies Partial<ServerFunctions>
}
