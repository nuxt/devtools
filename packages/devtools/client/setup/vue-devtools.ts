import { functions, onRpcConnected, rpc, useDevToolsState as useVueDevToolsState } from '@vue/devtools-core'
import { createRpcClient } from '@vue/devtools-kit'
import { watchEffect } from 'vue'
import { useDevToolsFrameState } from '../composables/storage'

export function setupVueDevTools() {
  const { connected } = useVueDevToolsState()

  const state = useDevToolsFrameState()

  const isInPopup = window.__NUXT_DEVTOOLS_IS_POPUP__

  function toggleClientDetected(state: boolean) {
    if (connected.value) {
      rpc.value.updateDevToolsClientDetected({
        iframe: state,
      })
    }
    else {
      onRpcConnected(() => {
        rpc.value.updateDevToolsClientDetected({
          iframe: state,
        })
      })
    }
  }

  watchEffect(() => {
    if (isInPopup) {
      toggleClientDetected(true)
    }
    else {
      toggleClientDetected(state.value?.open ?? false)
    }
  })

  createRpcClient(functions, {
    preset: 'iframe',
  })
  onRpcConnected(() => {
    rpc.value.initDevToolsServerListener()
  })
}
