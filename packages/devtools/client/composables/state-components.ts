import type { Component } from 'nuxt/schema'

export function useComponents() {
  const client = useClient()
  const serverComponents = useAsyncState('getComponents', () => rpc.getComponents())

  const globalComponents = computed(() =>
    Object
      .entries(client.value?.nuxt?.vueApp._context.components || {})
      .map(([key]) => ({
        pascalName: key,
        global: true,
      } as unknown as Component))
      // filter out lazy components
      .filter(i => !/^Lazy[A-Z]/.test(i.pascalName))
      // dedupe server components
      .filter(i => !(serverComponents.value || [])
        .find((s: any) => s.pascalName === i.pascalName)),
  )

  return computed(() => [
    ...globalComponents.value,
    ...serverComponents.value || [],
  ].sort((a: any, b: any) => a.pascalName.localeCompare(b.pascalName)))
}

export function useComponentsRelationships() {
  return useAsyncState('getComponentsRelationships', () => rpc.getComponentsRelationships())
}
