import type { Ref } from 'vue'
import type { HookInfo, RouteInfo, ServerFunctions } from '../../src/types'
import { objectPick } from '@antfu/utils'
import { computed } from 'vue'
import { useFetch } from '#app/composables/fetch'
import { RPC_NAMESPACE } from '../../src/rpc-namespace'
import { useClientRouter } from './client'
import { connectPromise, rpcClient } from './rpc'
import { useAsyncState } from './utils'

export function useServerPages() {
  return useAsyncState('getServerPages', async () => {
    const client = rpcClient.value || await connectPromise
    return client.call(`${RPC_NAMESPACE}:getServerPages` as any) as Promise<Awaited<ReturnType<ServerFunctions['getServerPages']>>>
  })
}

export function useServerRoutes() {
  return useAsyncState('getServerRoutes', async () => {
    const client = rpcClient.value || await connectPromise
    return client.call(`${RPC_NAMESPACE}:getServerRoutes` as any) as Promise<Awaited<ReturnType<ServerFunctions['getServerRoutes']>>>
  })
}

export function useServerTasks() {
  return useAsyncState('getServerTasks', async () => {
    const client = rpcClient.value || await connectPromise
    return client.call(`${RPC_NAMESPACE}:getServerTasks` as any) as Promise<Awaited<ReturnType<ServerFunctions['getServerTasks']>>>
  })
}

export function useServerHooks() {
  return useAsyncState('getServerHooks', async () => {
    const client = rpcClient.value || await connectPromise
    return client.call(`${RPC_NAMESPACE}:getServerHooks` as any) as Promise<Awaited<ReturnType<ServerFunctions['getServerHooks']>>>
  }) as Ref<HookInfo[] | undefined>
}

export function useLayouts() {
  return useAsyncState('getServerLayouts', async () => {
    const client = rpcClient.value || await connectPromise
    return client.call(`${RPC_NAMESPACE}:getServerLayouts` as any) as Promise<Awaited<ReturnType<ServerFunctions['getServerLayouts']>>>
  })
}

export function useAutoImports() {
  return useAsyncState('getAutoImports', async () => {
    const client = rpcClient.value || await connectPromise
    return client.call(`${RPC_NAMESPACE}:getAutoImports` as any) as Promise<Awaited<ReturnType<ServerFunctions['getAutoImports']>>>
  })
}

export function useStaticAssets() {
  return useAsyncState('getStaticAssets', async () => {
    const client = rpcClient.value || await connectPromise
    return client.call(`${RPC_NAMESPACE}:getStaticAssets` as any) as Promise<Awaited<ReturnType<ServerFunctions['getStaticAssets']>>>
  })
}

export function useServerConfig() {
  return useAsyncState('getServerConfig', async () => {
    const client = rpcClient.value || await connectPromise
    return client.call(`${RPC_NAMESPACE}:getServerConfig` as any) as Promise<Awaited<ReturnType<ServerFunctions['getServerConfig']>>>
  })
}

export function useServerDebugContext() {
  return useAsyncState('getServerDebugContext', async () => {
    const client = rpcClient.value || await connectPromise
    return client.call(`${RPC_NAMESPACE}:getServerDebugContext` as any) as Promise<Awaited<ReturnType<ServerFunctions['getServerDebugContext']>>>
  })
}

export function useServerRuntimeConfig() {
  return useAsyncState('getServerRuntimeConfig', async () => {
    const client = rpcClient.value || await connectPromise
    return client.call(`${RPC_NAMESPACE}:getServerRuntimeConfig` as any) as Promise<Awaited<ReturnType<ServerFunctions['getServerRuntimeConfig']>>>
  })
}

export function useModuleOptions() {
  return useAsyncState('getModuleOptions', async () => {
    const client = rpcClient.value || await connectPromise
    return client.call(`${RPC_NAMESPACE}:getModuleOptions` as any) as Promise<Awaited<ReturnType<ServerFunctions['getModuleOptions']>>>
  })
}

export function useServerApp() {
  return useAsyncState('getServerApp', async () => {
    const client = rpcClient.value || await connectPromise
    return client.call(`${RPC_NAMESPACE}:getServerApp` as any) as Promise<Awaited<ReturnType<ServerFunctions['getServerApp']>>>
  })
}

export function useCustomTabs() {
  return useAsyncState('getCustomTabs', async () => {
    const client = rpcClient.value || await connectPromise
    return client.call(`${RPC_NAMESPACE}:getCustomTabs` as any) as Promise<Awaited<ReturnType<ServerFunctions['getCustomTabs']>>>
  })
}

export function useAnalyzeBuildInfo() {
  return useAsyncState('getAnalyzeBuildInfo', async () => {
    const client = rpcClient.value || await connectPromise
    return client.call(`${RPC_NAMESPACE}:getAnalyzeBuildInfo` as any) as Promise<Awaited<ReturnType<ServerFunctions['getAnalyzeBuildInfo']>>>
  })
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
