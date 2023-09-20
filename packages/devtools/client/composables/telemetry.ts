export function telemetry(event: string, payload?: object) {
  rpc.telemetryEvent({
    event,
    browser: userAgentInfo.browser.name,
    browserVersion: userAgentInfo.browser.version,
    os: userAgentInfo.os.name,
    osVersion: userAgentInfo.os.version,
    deviceType: userAgentInfo.device.type,
    ...payload,
  })
}
