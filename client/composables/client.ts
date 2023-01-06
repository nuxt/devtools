import type { NuxtAppClient } from '~/../src/types'

export function useClient() {
  return useState<NuxtAppClient>('devtools-client')
}
