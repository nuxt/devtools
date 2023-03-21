import type { DefineComponent } from 'vue'

export interface TemplatePromiseProps<Return, Args extends any[] = []> {
  promise: Promise<Return> | undefined
  resolve: (v: Return) => void
  reject: (v: any) => void
  args: Args
}

export type TemplatePromise<Return, Args extends any[] = []> = DefineComponent<{}> & {
  new(): {
    $slots: {
      default(_: TemplatePromiseProps<Return, Args>): any
    }
  }
} & {
  start: (...args: Args) => Promise<Return>
}

export function useTemplatePromise<Return, Args extends any[] = []>(): TemplatePromise<Return, Args> {
  const props = shallowReactive<TemplatePromiseProps<Return, Args>>({
    promise: undefined,
    resolve: () => {},
    reject: () => {},
    args: undefined!,
  })

  function start(...args: Args) {
    if (!props.promise) {
      props.args = args
      props.promise = new Promise<Return>((_resolve, _reject) => {
        props.resolve = _resolve
        props.reject = _reject
      })
        .finally(() => {
          props.promise = undefined
        })
    }
    return props.promise
  }

  const component = defineComponent((_, { slots }) => {
    return () => props.promise
      ? slots.default?.(props)
      : null
  })

  component.start = start

  return component as any
}
