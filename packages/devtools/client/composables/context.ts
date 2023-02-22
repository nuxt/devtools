export function useSingleton<T>() {
  const key = Symbol('singleton')
  return [
    function provide(v: T) {
      const vm = getCurrentInstance()
      vm?.appContext.app.provide(key, v)
    },
    function use(fallback?: T) {
      return inject(key, fallback) as T
    },
  ] as const
}

const [
  provideNotification,
  useNotification,
] = useSingleton<(text: string, icon?: string, duration?: number) => void>()

export {
  provideNotification,
  useNotification,
}
