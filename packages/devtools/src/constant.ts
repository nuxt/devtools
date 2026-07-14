import type { ModuleOptions, NuxtDevToolsOptions } from './types'

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

export const defaultTabOptions: NuxtDevToolsOptions = {
  behavior: {
    telemetry: null,
    openInEditor: undefined,
  },
  ui: {
    componentsView: 'list',
    componentsGraphShowNodeModules: false,
    componentsGraphShowGlobalComponents: true,
    componentsGraphShowPages: false,
    componentsGraphShowLayouts: false,
    componentsGraphShowWorkspace: true,
    interactionCloseOnOutsideClick: false,
    showExperimentalFeatures: false,
    showHelpButtons: true,
    scale: 1,
    hiddenTabs: [],
    pinnedTabs: [],
    hiddenTabCategories: [],
    sidebarExpanded: false,
    sidebarScrollable: false,
  },
  serverRoutes: {
    selectedRoute: null,
    view: 'tree',
    inputDefaults: {
      query: [],
      body: [],
      headers: [],
    },
    sendFrom: 'app',
  },
  serverTasks: {
    enabled: false,
    selectedTask: null,
    view: 'list',
    inputDefaults: {
      query: [],
      body: [],
      headers: [{ active: true, key: 'Content-Type', value: 'application/json', type: 'string' }],
    },
  },
  assets: {
    view: 'grid',
  },
}

export const defaultAllowedExtensions = [
  'png',
  'jpg',
  'jpeg',
  'gif',
  'svg',
  'webp',
  'ico',
  'mp4',
  'ogg',
  'mp3',
  'wav',
  'mov',
  'mkv',
  'mpg',
  'txt',
  'ttf',
  'woff',
  'woff2',
  'eot',
  'json',
  'js',
  'jsx',
  'ts',
  'tsx',
  'md',
  'mdx',
  'vue',
  'webm',
]
