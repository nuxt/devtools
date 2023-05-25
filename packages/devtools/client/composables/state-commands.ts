import { randomStr } from '@antfu/utils'
import type { MaybeRefOrGetter } from 'vue'

export interface CommandItem {
  id: string
  title: string
  icon?: string
  action: () => void
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
      action: () => router.push('/settings'),
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
