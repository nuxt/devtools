import { HandShakeServer, getDevToolsState, initDevToolsSeparateWindow, initDevToolsSeparateWindowBridge, onDevToolsStateUpdated, setupDevToolsBridge } from '@vue/devtools-core'
import type { AppRecord } from '@vue/devtools-kit'
import { toggleHighPerfMode } from '@vue/devtools-kit'

export type DevtoolsBridgeAppRecord = Pick<AppRecord, 'name' | 'id' | 'version' | 'routerId' | 'moduleDetectives'>

const appConnected = ref(false)
const clientConnected = ref(false)
const appRecords = ref<Array<DevtoolsBridgeAppRecord>>([])
const activeAppRecordId = ref<string | null>(null)
export const connected = computed(() => appConnected.value && clientConnected.value)
export const activeAppRecord = computed(() => appRecords.value.find(r => r.id === activeAppRecordId.value))

export function initVueDevToolsState() {
  getDevToolsState().then((data) => {
    if (!data)
      return
    appConnected.value = data.connected
    clientConnected.value = data.clientConnected
    appRecords.value = data.appRecords
    activeAppRecordId.value = data.activeAppRecordId
  })

  onDevToolsStateUpdated((data) => {
    if (!data)
      return
    appConnected.value = data.connected
    clientConnected.value = data.clientConnected
    appRecords.value = data.appRecords
    activeAppRecordId.value = data.activeAppRecordId
  })

  return {
    appRecords,
    activeAppRecord,
  }
}

export function setupVueDevTools() {
  const state = useDevToolsFrameState()

  const isInPopup = window.__NUXT_DEVTOOLS_IS_POPUP__

  watchEffect(() => {
    if (isInPopup)
      toggleHighPerfMode(false)
    else
      toggleHighPerfMode(!state.value?.open)
  })

  initDevToolsSeparateWindow({
    onConnected(channel) {
      const bridge = initDevToolsSeparateWindowBridge(channel)
      setupDevToolsBridge(bridge)
      new HandShakeServer(bridge).onnConnect().then(() => {
        bridge.emit('devtools:client-ready')
        initVueDevToolsState()
      })
      bridge.on('disconnect', () => {
        channel.close()
        initDevToolsSeparateWindow()
      })
    },
  })
}
