import { relative } from 'pathe'
import type { AsyncDataOptions } from '#app'
import type { ComponentRelationship, ComponentWithRelationships, NormalizedHeadTag, SocialPreviewCard, SocialPreviewResolved } from '~/../src/types'
import type { Component } from 'nuxt/schema'
import type { Ref } from 'vue'

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

export function useAsyncState<T>(key: string, fn: () => Promise<T>, options?: AsyncDataOptions<T>) {
  const nuxt = useNuxtApp()

  const unique = nuxt.payload.unique = nuxt.payload.unique || {} as any
  if (!unique[key])
    unique[key] = useAsyncData(key, fn, options)

  return unique[key].data as Ref<T | null>
}

export function getIsMacOS() {
  return typeof navigator !== 'undefined' && navigator.platform.toLowerCase().includes('mac')
}

// @unocss-include
const requestMethodClass: Record<string, string> = {
  get: 'n-green',
  post: 'n-blue',
  put: 'n-orange',
  delete: 'n-red',
  patch: 'n-purple',
  head: 'n-teal',
  default: 'n-gray',
}

export function getRequestMethodClass(method: string) {
  return requestMethodClass[method.toLowerCase()] || requestMethodClass.default
}

export function getSocialPreviewCard(
  rawTags: NormalizedHeadTag[],
  tags: SocialPreviewCard,
): SocialPreviewResolved {
  const resolvedTags: { [key: string]: string | undefined } = {}

  for (const [key, value] of Object.entries(tags)) {
    for (const tag of value) {
      const tagValue = rawTags.find(item => item.tag === tag.tag && (tag.name ? item.name === tag.name : true))?.value
      if (tagValue) {
        resolvedTags[key] = tagValue
        break
      }
    }
  }

  return {
    url: window.location.host,
    ...resolvedTags,
  }
}

export function formatDuration(ms: number) {
  if (Number.isNaN(ms) || ms < 0)
    return '-'
  if (ms < 1)
    return '<1ms'
  if (ms < 1000)
    return `${ms}ms`
  if (ms < 1000 * 60)
    return `${(ms / 1000).toFixed(2)}s`
  return `${(ms / 1000 / 60).toFixed(2)}min`
}

export function getHashColorFromString(name: string, saturation = 65, lightness = 50, opacity: number | string = 1) {
  let hash = 0
  for (let i = 0; i < name.length; i++)
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  const h = hash % 360
  return `hsla(${h}, ${saturation}%, ${lightness}%, ${opacity})`
}

export function useSessionState<T>(name: string, initialValue: T) {
  return useState(name, () => {
    return useSessionStorage(name, initialValue, { listenToStorageChanges: false })
  })
}

export function getComponentRelationships(component: Component, relationships?: ComponentRelationship[] | null): ComponentWithRelationships {
  const dependencies = relationships
    ?.find(i => i.id === component.filePath)
    ?.deps
    ?.map(i => relationships?.find(j => j.id === i)?.id)
    .filter(Boolean) as string[] | undefined
  const dependents = relationships
    ?.filter(i => i.deps.includes(component.filePath))
    .map(i => i.id)

  return {
    component,
    dependencies,
    dependents,
  }
}

export function pluralizeByCount(count: number, singular: string, plural = `${singular}s`) {
  return `${count} ${count <= 1 ? singular : plural}`
}

export function refreshData() {
  const client = useClient()
  const nuxt = useNuxtApp()

  nuxt.hooks.callHookParallel('app:data:refresh', Object.keys(nuxt.payload.data))
  triggerRef(client)
  client.value.revision.value += 1
}

export function reloadPage() {
  location.reload()
}
