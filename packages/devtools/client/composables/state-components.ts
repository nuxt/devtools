import type { Component } from 'nuxt/schema'
import type { ServerFunctions } from '../../src/types'
import { computed } from 'vue'
import { RPC_NAMESPACE } from '../../src/rpc-namespace'
import { useClient } from './client'
import { connectPromise, rpcClient } from './rpc'
import { useAsyncState } from './utils'

const LAZY_COMPONENT_RE = /^Lazy[A-Z]/

export function useComponents() {
  const client = useClient()
  const serverComponents = useAsyncState('getComponents', async () => {
    const rpcClientInstance = rpcClient.value || await connectPromise
    return rpcClientInstance.call(`${RPC_NAMESPACE}:getComponents` as any) as Promise<Awaited<ReturnType<ServerFunctions['getComponents']>>>
  })

  const globalComponents = computed(() =>
    Object
      .entries(client.value?.nuxt?.vueApp._context.components || {})
      .map(([key]) => ({
        pascalName: key,
        global: true,
      } as unknown as Component))
      // filter out lazy components
      .filter(i => !LAZY_COMPONENT_RE.test(i.pascalName))
      // dedupe server components
      .filter(i => !serverComponents.value || [].some((s: any) => s.pascalName === i.pascalName)))

  return computed(() => [
    ...globalComponents.value,
    ...serverComponents.value || [],
  ].sort((a: any, b: any) => a.pascalName.localeCompare(b.pascalName)))
}

export function useComponentsRelationships() {
  return useAsyncState('getComponentsRelationships', async () => {
    const client = rpcClient.value || await connectPromise
    return client.call(`${RPC_NAMESPACE}:getComponentsRelationships` as any) as Promise<Awaited<ReturnType<ServerFunctions['getComponentsRelationships']>>>
  })
}
