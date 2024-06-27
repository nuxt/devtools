import { functions, onRpcConnected, rpc } from '@vue/devtools-core'
import { createRpcClient, toggleHighPerfMode } from '@vue/devtools-kit'

export function setupVueDevTools() {
  const state = useDevToolsFrameState()

  const isInPopup = window.__NUXT_DEVTOOLS_IS_POPUP__

  watchEffect(() => {
    if (isInPopup)
      toggleHighPerfMode(false)
    else
      toggleHighPerfMode(!state.value?.open)
  })

  createRpcClient(functions, {
    preset: 'iframe',
  })
  onRpcConnected(() => {
    rpc.value.initDevToolsServerListener()
  })
}
