import { activeAppRecord, connected } from '../setup/vue-devtools'

export function useVueDevToolsState() {
  return {
    activeAppRecord,
    connected,
  }
}

export function onVueDevToolsClientConnected(callback: () => void) {
  if (connected.value) {
    callback()
  }
  else {
    const stop = watch(connected, (value) => {
      if (value) {
        stop()
        callback()
      }
    })
  }
}
