import type { ModuleOptions } from './types'

export const ROUTE_PATH = '/__nuxt_devtools__'
export const ROUTE_ENTRY = `${ROUTE_PATH}/entry`
export const ROUTE_CLIENT = `${ROUTE_PATH}/client`
export const ROUTE_ANALYZE = `${ROUTE_PATH}/analyze`
export const WS_EVENT_NAME = 'nuxt:devtools:rpc'

export const defaultOptions: ModuleOptions = {
  enabled: undefined, // determine multiple conditions
  componentInspector: true,
  viteInspect: true,
  vscode: {
    enabled: true,
    startOnBoot: false,
    port: 3080,
    reuseExistingServer: true,
  },
}
