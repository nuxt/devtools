import { relative } from 'pathe'
import type { Ref } from 'vue'
import type { AsyncDataOptions } from '#app'

export function isNodeModulePath(path: string) {
  return !!path.match(/[/\\]node_modules[/\\]/) || isPackageName(path)
}

export function isPackageName(name: string) {
  return name[0] === '#' || !!name.match(/^(@[a-z0-9-~][a-z0-9-._~]*\/)?[a-z0-9-~][a-z0-9-._~]*$/)
}

export function getModuleNameFromPath(path: string) {
  if (isPackageName(path))
    return path
  const match = path.replace(/\\/g, '/').match(/.*\/node_modules\/(.*)$/)?.[1]
  if (!match)
    return undefined
  if (match.startsWith('@'))
    return match.split('/').slice(0, 2).join('/')
  return match.split('/')[0]
}

function getModuleSubpathFromPath(path: string) {
  const match = path.match(/.*\/node_modules\/(.*)$/)?.[1]
  if (!match)
    return undefined
  return match
}

export function isBuiltInModule(name: string | undefined) {
  if (!name)
    return
  return ['nuxt', '#app', '#head', 'vue'].includes(name)
}

export function parseReadablePath(path: string, root: string) {
  path = path.replace(/\\/g, '/')
  if (isPackageName(path)) {
    return {
      moduleName: path,
      path,
    }
  }
  const moduleName = getModuleNameFromPath(path)
  const subpath = getModuleSubpathFromPath(path)
  if (moduleName && subpath) {
    return {
      moduleName,
      path: subpath,
    }
  }
  // Workaround https://github.com/unjs/pathe/issues/113
  try {
    let result = relative(root, path)
    if (!result.startsWith('./') && !result.startsWith('../'))
      result = `./${result}`
    if (result.startsWith('./.nuxt/'))
      result = `#build${result.slice(7)}`
    return { path: result }
  }
  catch {
    return { path }
  }
}

export function parseExpressRoute(route: string) {
  return route.split(/(:\w+[\?\*]?)/).filter(Boolean)
}

export function useAsyncState<T>(key: string, fn: () => Promise<T>, options?: AsyncDataOptions<T>) {
  const nuxt = useNuxtApp()
  if (!nuxt.payload.unique)
    nuxt.payload.unique = {}

  if (!nuxt.payload.unique[key])
    nuxt.payload.unique[key] = useAsyncData(key, fn, options)

  return nuxt.payload.unique[key].data as Ref<T | null>
}

export function getIsMacOS() {
  return typeof navigator !== 'undefined' && navigator.platform.toLowerCase().includes('mac')
}
