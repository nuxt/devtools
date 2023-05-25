import semver from 'semver'
import type { NpmCommandOptions } from '../../src/types'

export type PackageUpdateState = 'idle' | 'running' | 'updated'

const map = new Map<string, any>()

export function usePackageUpdate(name: string, options?: NpmCommandOptions): ReturnType<typeof getPackageUpdate> {
  const key = name
  if (!map.has(key))
    map.set(key, getPackageUpdate(name, options))
  return map.get(key)
}

export function useNuxtVersion() {
  return useAsyncState('npm:check:nuxt', () => rpc.checkForUpdateFor('nuxt'))
}

export function satisfyNuxtVersion(range: string) {
  const nuxt = useNuxtVersion()
  return computed(() => {
    if (!nuxt?.value?.current)
      return false
    return semver.satisfies(nuxt.value.current, range)
  })
}

function getPackageUpdate(name: string, options?: NpmCommandOptions) {
  const nuxt = useNuxtApp()
  const info = useAsyncState(`npm:check:${name}`, () => rpc.checkForUpdateFor(name))

  const state = ref<PackageUpdateState>('idle')

  const processId = ref<string | undefined>()

  // @ts-expect-error missing hooks type
  nuxt.hook('devtools:terminal:exit', ({ id, code }) => {
    if (id !== processId || !processId)
      return
    state.value = code === 0 ? 'updated' : 'idle'
  })

  async function update(confirm: (command: string) => Promise<boolean>) {
    if (state.value !== 'idle')
      return

    const command = await rpc.getNpmCommand('update', name, options)
    if (!command)
      return

    if (!await confirm(command.join(' ')))
      return

    state.value = 'running'

    processId.value = (await rpc.runNpmCommand('update', name, options))?.processId

    return processId.value
  }

  async function restart() {
    if (state.value !== 'updated')
      return
    await rpc.restartNuxt()
  }

  return {
    info,
    state,
    update,
    restart,
    processId,
  }
}
