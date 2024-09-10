import { objectPick } from '@antfu/utils'
import type { Ref } from 'vue'
import type { HookInfo, RouteInfo } from '../../src/types'

export function useServerPages() {
  return useAsyncState('getServerPages', () => rpc.getServerPages())
}

export function useServerRoutes() {
  return useAsyncState('getServerRoutes', () => rpc.getServerRoutes())
}

export function useServerTasks() {
  return useAsyncState('getServerTasks', () => rpc.getServerTasks())
}

export function useServerHooks() {
  return useAsyncState('getServerHooks', () => rpc.getServerHooks()) as Ref<HookInfo[] | undefined>
}

export function useLayouts() {
  return useAsyncState('getServerLayouts', () => rpc.getServerLayouts())
}

export function useAutoImports() {
  return useAsyncState('getAutoImports', () => rpc.getAutoImports())
}

export function useStaticAssets() {
  return useAsyncState('getStaticAssets', () => rpc.getStaticAssets())
}

export function useServerConfig() {
  return useAsyncState('getServerConfig', () => rpc.getServerConfig())
}

export function useServerRuntimeConfig() {
  return useAsyncState('getServerRuntimeConfig', () => rpc.getServerRuntimeConfig())
}

export function useModuleOptions() {
  return useAsyncState('getModuleOptions', () => rpc.getModuleOptions())
}

export function useServerApp() {
  return useAsyncState('getServerApp', () => rpc.getServerApp())
}

export function useCustomTabs() {
  return useAsyncState('getCustomTabs', () => rpc.getCustomTabs())
}

export function useTerminals() {
  return useAsyncState('getTerminals', () => rpc.getTerminals())
}

export function useAnalyzeBuildInfo() {
  return useAsyncState('getAnalyzeBuildInfo', () => rpc.getAnalyzeBuildInfo())
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
