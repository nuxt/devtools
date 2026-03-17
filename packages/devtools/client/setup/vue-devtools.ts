import { functions, onRpcConnected, rpc, useDevToolsState } from '@vue/devtools-core'
import { createRpcClient } from '@vue/devtools-kit'
import { watchEffect } from 'vue'
import { useDevToolsFrameState } from '../composables/storage'

let initiated = false

export function useVueDevToolsState() {
  ensureVueDevTools()
  return useDevToolsState()
}

export function ensureVueDevTools() {
  if (initiated)
    return
  initiated = true
  const { connected } = useDevToolsState()

  const state = useDevToolsFrameState()

  function toggleClientDetected(detected: boolean) {
    if (connected.value) {
      rpc.value.updateDevToolsClientDetected({
        iframe: detected,
      })
    }
    else {
      onRpcConnected(() => {
        rpc.value.updateDevToolsClientDetected({
          iframe: detected,
        })
      })
    }
  }

  watchEffect(() => {
    toggleClientDetected(state.value?.open ?? false)
  })

  createRpcClient(functions, {
    preset: 'iframe',
  })
  onRpcConnected(() => {
    rpc.value.initDevToolsServerListener()
  })
}
