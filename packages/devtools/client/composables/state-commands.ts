import { randomStr } from '@antfu/utils'
import type { MaybeRefOrGetter } from 'vue'

export interface CommandItem {
  id: string
  title: string
  description?: string
  icon?: string
  action: () => void | CommandItem[] | Promise<CommandItem[]>
}

const registeredCommands = reactive(new Map<string, MaybeRefOrGetter<CommandItem[]>>())

export function useCommands() {
  const tabs = useEnabledTabs()
  const router = useRouter()

  const fixedCommands: CommandItem[] = [
    {
      id: 'fixed:settings',
      title: 'Settings',
      icon: 'carbon-settings-adjust',
      action: () => {
        router.push('/settings')
      },
    },
    {
      id: 'fixed:docs',
      title: 'Nuxt Documentations',
      icon: 'logos-nuxt-icon',
      action: () => {
        return getNuxtDocsCommands()
      },
    },
  ]

  const tabCommands = computed(() => tabs.value
    .map((i): CommandItem => {
      return {
        id: `tab:${i.name}`,
        title: i.title || i.name,
        icon: i.icon,
        action: () => {
          if ('onClick' in i && i.onClick)
            i.onClick()
          else
            router.push(('path' in i && i.path) ? i.path : `/modules/custom-${i.name}`)
        },
      }
    }),
  )

  return computed(() => {
    return [
      ...fixedCommands,
      ...tabCommands.value,
      ...Array.from(registeredCommands.values())
        .flatMap(i => toValue(i)),
    ]
  })
}

export function registerCommands(getter: MaybeRefOrGetter<CommandItem[]>) {
  const id = randomStr()

  registeredCommands.set(id, getter)

  onUnmounted(() => {
    registeredCommands.delete(id)
  })
}

let _nuxtDocsCommands: CommandItem[] | undefined

const docsIcons = [
  [':components:', 'i-carbon-assembly-cluster'],
  [':modules:', 'i-carbon-cube'],
  [':commands:', 'i-carbon-terminal'],
  [':directory-structure:', 'i-carbon-folder'],
  [':composables:', 'i-carbon-function'],
  [':getting-started:', 'i-carbon-idea'],
  [':api:', 'carbon-api-1'],
]

export async function getNuxtDocsCommands() {
  if (!_nuxtDocsCommands) {
    const list = await import('../data/nuxt-docs.json').then(i => i.default)
    _nuxtDocsCommands = list.map(i => ({
      ...i,
      icon: docsIcons.find(([k]) => i.id.includes(k))?.[1] || 'i-carbon-document-multiple-01',
      action: () => {
        window.open(i.url, '_blank')
      },
    }))
  }
  return _nuxtDocsCommands
}
