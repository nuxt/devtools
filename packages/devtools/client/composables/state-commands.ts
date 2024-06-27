import { randomStr } from '@antfu/utils'
import type { MaybeRefOrGetter } from 'vue'

export interface CommandItem {
  id: string
  title: string
  description?: string
  icon?: string
  action: () => void | CommandItem[] | Promise<CommandItem[] | void>
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
    }))

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

export async function getNuxtDocsCommands() {
  if (!_nuxtDocsCommands) {
    const list = await $fetch<any[]>('https://nuxt.com/api/search.json', {
      query: {
        select: '_path,title,description,navigation',
      },
    })
    _nuxtDocsCommands = list.map(i => ({
      id: i._path,
      title: i.title,
      description: i.description,
      icon: i.navigation?.icon ?? 'i-carbon-document-multiple-01',
      action: () => {
        window.open(`https://nuxt.com/${i._path}`, '_blank')
      },
    }))
  }
  return _nuxtDocsCommands
}
