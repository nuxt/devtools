import { useClipboard } from '@vueuse/core'

export function useOpenInEditor() {
  const config = useServerConfig()
  const virtualFiles = useVirtualFiles()
  const router = useRouter()
  const virtualFileId = useCurrentVirtualFile()

  return async (filepath: string) => {
    const buildDir = config.value?.buildDir
    const path = (buildDir && filepath.startsWith(buildDir))
      ? `#build${filepath.slice(buildDir.length)}`
      : filepath

    const [realpath, _line = 1, _col = 0] = path.split(/:/g)

    const vfs = virtualFiles.value?.entries.find(i => i.path === realpath || i.id === realpath)
    || virtualFiles.value?.entries.find(i => i.path === filepath || i.id === filepath)
    if (vfs) {
      // TODO: support line and col
      virtualFileId.value = vfs.id
      router.push('/modules/virtual-files')
    }
    else {
      await rpc.openInEditor(filepath)
    }
  }
}

export function useCopy() {
  const clipboard = useClipboard()

  return (text: string) => {
    clipboard.copy(text)

    devtoolsUiShowNotification({
      message: 'Copied to clipboard',
      icon: 'carbon-checkmark',
    })
  }
}
