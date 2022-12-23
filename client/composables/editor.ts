import { useClipboard } from '@vueuse/core'

export async function openInEditor(filepath: string) {
  await rpc.openInEditor(filepath)
}

export function useCopy() {
  const clipboard = useClipboard()
  const showNotification = useNotification()

  return (text: string) => {
    clipboard.copy(text)
    showNotification('Copied to clipboard', 'carbon-checkmark')
  }
}
