export const telemetryEnabled = useDevToolsOptions('behavior').telemetry

export function telemetry(event: string, payload?: object, immediate = false) {
  if (telemetryEnabled.value === false)
    return

  rpc.telemetryEvent({
    event,
    browser: userAgentInfo.browser.name,
    browserVersion: userAgentInfo.browser.version,
    os: userAgentInfo.os.name,
    osVersion: userAgentInfo.os.version,
    deviceType: userAgentInfo.device.type,
    inPopup: !!window.__NUXT_DEVTOOLS_IS_POPUP__,
    ...payload,
  }, immediate)
}
