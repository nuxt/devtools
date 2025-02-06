import { useSessionState } from './utils'

export function useSchemaInput() {
  return useSessionState<{
    name?: string
    input: string
  } | null>('schema:input', null)
}
