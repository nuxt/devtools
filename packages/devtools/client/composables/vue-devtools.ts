import { activeAppRecord, connected } from '../setup/vue-devtools'

export function useVueDevToolsState() {
  return {
    activeAppRecord,
    connected,
  }
}

export function onVueDevToolsConnected(callback: () => void) {
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
