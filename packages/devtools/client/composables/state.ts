import type { Ref } from 'vue'
import type { HookInfo, RouteInfo } from '../../src/types'
import { objectPick } from '@antfu/utils'
import { computed } from 'vue'
import { useFetch } from '#app/composables/fetch'
import { useClientRouter } from './client'
import { useDevtoolsRpc } from './rpc'
import { useAsyncState } from './utils'

export function useServerPages() {
  return useAsyncState('getServerPages', async () => (await useDevtoolsRpc()).call('getServerPages'))
}

export function useServerRoutes() {
  return useAsyncState('getServerRoutes', async () => (await useDevtoolsRpc()).call('getServerRoutes'))
}

export function useServerTasks() {
  return useAsyncState('getServerTasks', async () => (await useDevtoolsRpc()).call('getServerTasks'))
}

export function useServerHooks() {
  return useAsyncState('getServerHooks', async () => (await useDevtoolsRpc()).call('getServerHooks')) as Ref<HookInfo[] | undefined>
}

export function useLayouts() {
  return useAsyncState('getServerLayouts', async () => (await useDevtoolsRpc()).call('getServerLayouts'))
}

export function useAutoImports() {
  return useAsyncState('getAutoImports', async () => (await useDevtoolsRpc()).call('getAutoImports'))
}

export function useStaticAssets() {
  return useAsyncState('getStaticAssets', async () => (await useDevtoolsRpc()).call('getStaticAssets'))
}

export function useServerConfig() {
  return useAsyncState('getServerConfig', async () => (await useDevtoolsRpc()).call('getServerConfig'))
}

export function useServerDebugContext() {
  return useAsyncState('getServerDebugContext', async () => (await useDevtoolsRpc()).call('getServerDebugContext'))
}

export function useServerRuntimeConfig() {
  return useAsyncState('getServerRuntimeConfig', async () => (await useDevtoolsRpc()).call('getServerRuntimeConfig'))
}

export function useModuleOptions() {
  return useAsyncState('getModuleOptions', async () => (await useDevtoolsRpc()).call('getModuleOptions'))
}

export function useServerApp() {
  return useAsyncState('getServerApp', async () => (await useDevtoolsRpc()).call('getServerApp'))
}

export function useCustomTabs() {
  return useAsyncState('getCustomTabs', async () => (await useDevtoolsRpc()).call('getCustomTabs'))
}

export function useAnalyzeBuildInfo() {
  return useAsyncState('getAnalyzeBuildInfo', async () => (await useDevtoolsRpc()).call('getAnalyzeBuildInfo'))
}

export interface VfsData {
  rootDir: string
  entries: {
    id: string
    path: string
  }[]
}

export interface VfsFile {
  id: string
  content: string
}

export function useVirtualFiles() {
  const { data } = useFetch<VfsData>('/_vfs.json', {
    key: 'vfs-list',
    baseURL: '/',
    responseType: 'json',
  })
  return data
}

export function useMergedRouteList() {
  const serverPages = useServerPages()
  const router = useClientRouter()

  return computed((): RouteInfo[] => {
    return (router.value?.getRoutes() || [])
      .map(i => objectPick(i, ['path', 'name', 'meta', 'props', 'children']))
      .map((i) => {
        return {
          ...serverPages.value?.find(j => j.name && j.name === i.name),
          ...i,
        }
      })
  })
}
