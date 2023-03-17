export type PackageUpdateState = 'idle' | 'running' | 'updated'

const map = new Map<string, any>()

export function usePackageUpdate(name: string, flags: string[] = []): ReturnType<typeof getPackageUpdate> {
  const key = `${name}:${flags.join(',')}`
  if (!map.has(key))
    map.set(key, getPackageUpdate(name, flags))
  return map.get(key)
}

function getPackageUpdate(name: string, flags: string[] = []) {
  const nuxt = useNuxtApp()
  const info = useAsyncData(`npm:check:${name}`, () => rpc.checkForUpdateFor(name)).data
  const router = useRouter()

  const agent = useAsyncData('npm:agent', () => rpc.getPackageManager())
  const args = computed(() => [
    agent.data.value === 'yarn' ? 'add' : 'install',
    `${name}@latest`,
    ...flags,
    '--ignore-scripts',
  ])

  const state = ref<PackageUpdateState>('idle')

  const processId = `npm:${name}`

  // @ts-expect-error missing hooks type
  nuxt.hook('devtools:terminal:exit', ({ id, code }) => {
    if (id !== processId)
      return
    state.value = code === 0 ? 'updated' : 'idle'
  })

  async function update() {
    if (state.value !== 'idle')
      return
    const command = [(await agent).data.value, ...args.value].join(' ')
    if (!confirm(`Going to run "${command}", are you sure?`))
      return

    state.value = 'running'

    await rpc.executeBashCommand({
      command: (await agent).data.value || 'npm',
      args: args.value,
    }, {
      id: processId,
      name: `Update ${name}`,
      icon: 'i-mdi-npm-variant-outline text-red',
      restartable: false,
    })

    router.push(`/modules/terminals?id=${encodeURIComponent(processId)}`)
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
    processId,
    restart,
  }
}
