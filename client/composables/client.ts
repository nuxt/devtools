import type { NuxtAppClient, VueInspectorData } from '~/../src/types'

export function useClient() {
  return useState<NuxtAppClient>('devtools-client')
}

export function useComponentInspectorData() {
  return useState<VueInspectorData>('devtools-component-inspector-data')
}
