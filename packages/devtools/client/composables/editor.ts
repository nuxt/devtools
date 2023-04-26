import { useClipboard } from '@vueuse/core'

export function useOpenInEditor() {
  const config = useServerConfig()
  const virtualFiles = useVirtualFiles()
  const router = useRouter()

  return async (filepath: string) => {
    const buildDir = config.value?.buildDir
    const path = (buildDir && filepath.startsWith(buildDir))
      ? `#build${filepath.slice(buildDir.length).replace(/\.\w+$/, '')}`
      : filepath

    const vfs = virtualFiles.value?.entries.find(i => i.path === path || i.id === path)
    || virtualFiles.value?.entries.find(i => i.path === filepath || i.id === filepath)
    if (vfs)
      router.push(`/modules/virtual-files?id=${encodeURIComponent(vfs.id)}`)
    else
      await rpc.openInEditor(filepath)
  }
}

export function useCopy() {
  const clipboard = useClipboard()
  const showNotification = useNotification()

  return (text: string) => {
    clipboard.copy(text)
    showNotification('Copied to clipboard', 'carbon-checkmark')
  }
}
