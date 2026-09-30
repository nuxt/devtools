// keyed function factory macro (nuxt/nuxt#34934): must not be wrapped by the timeline
export const useApiData = createUseFetch(options => ({
  ...options,
  method: 'POST',
  body: { name: 'timeline' },
}))
