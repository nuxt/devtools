export const telemetryEnabled = ref(await rpc.getOptions('behavior').then(options => options.telemetry))

watch(telemetryEnabled, async (value) => {
  await rpc.updateOptions('behavior', { telemetry: value })
})

export function telemetry(event: string, payload?: object) {
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
  })
}
