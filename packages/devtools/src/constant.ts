import type { ModuleOptions, NuxtDevToolsOptions } from './types'
import { provider } from 'std-env'

const isSandboxed = provider === 'stackblitz' || provider === 'codesandbox'

export const defaultOptions: ModuleOptions = {
  enabled: undefined, // determine multiple conditions
  componentInspector: true,
  viteInspect: true,
  codeServer: {
    enabled: true,
  },
  disableAuthorization: isSandboxed,
}

// Nitro's experimental `tasks` feature toggles the default `serverTasks.enabled`
// value; this is the only genuinely dynamic default, so it's tracked as an
// explicit flag rather than by mutating a shared options object (see
// `setServerTasksEnabledByDefault`).
let serverTasksEnabledByDefault = false

/**
 * Called when the host Nuxt app has opted into Nitro's experimental `tasks`
 * feature, so `createDefaultTabOptions()` defaults `serverTasks.enabled` to
 * `true` for apps that haven't explicitly configured it.
 */
export function setServerTasksEnabledByDefault(enabled: boolean) {
  serverTasksEnabledByDefault = enabled
}

/**
 * Builds a brand-new default tab options object graph.
 *
 * This is a factory rather than a shared constant on purpose: callers used to
 * share (and sometimes mutate) a single module-level object, which let one
 * project's settings permanently overwrite the defaults for every other Nuxt
 * instance in the same process. Call this every time you need a default —
 * never cache or mutate its result.
 */
export function createDefaultTabOptions(): NuxtDevToolsOptions {
  return {
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
      showExperimentalFeatures: false,
      showHelpButtons: true,
      scale: 1,
      hiddenTabs: [],
      pinnedTabs: [],
      hiddenTabCategories: [],
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
      enabled: serverTasksEnabledByDefault,
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
