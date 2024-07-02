import type { InstalledModuleInfo, ModuleStaticInfo } from '../../src/types'

const ignoredModules = [
  'pages',
  'meta',
  'components',
  'imports',
  'nuxt-config-schema',
  '@nuxt/devtools',
  '@nuxt/telemetry',
]

export function useModulesList() {
  return useAsyncState('getModulesList', async () => {
    const m = await $fetch<{ modules: ModuleStaticInfo[] }>('https://api.nuxt.com/modules?version=3')
    return m.modules
      .filter((item: ModuleStaticInfo) => !ignoredModules.includes(item.npm) && item.compatibility.nuxt.includes('>=3'))
  })
}

export function useInstalledModules() {
  return useState('installed-modules', () => {
    const config = useServerConfig()
    const modules = useModulesList()

    return computed(() => (config.value?._installedModules || [])
      .map((mod): InstalledModuleInfo => {
        // hide inline modules
        if (!mod.entryPath)
          return undefined!

        const isPackageModule = !!(mod.entryPath && isNodeModulePath(mod.entryPath))
        const name = mod.meta?.name
          ? mod.meta?.name
          : mod.entryPath
            ? isPackageModule
              ? getModuleNameFromPath(mod.entryPath)
              : config.value?.rootDir
                ? parseReadablePath(mod.entryPath, config.value?.rootDir).path
                : undefined
            : undefined

        const isUninstallable = !!config.value?.modules?.includes(name)
        const info = modules.value?.find(m => m.npm === name) || modules.value?.find(m => m.name === name)

        return {
          name,
          isPackageModule,
          isUninstallable,
          info,
          ...mod,
        }
      })
      .filter(i => i && (!i.name || !ignoredModules.includes(i.name))))
  })
}
