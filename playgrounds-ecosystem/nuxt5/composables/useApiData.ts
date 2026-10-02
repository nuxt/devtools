// keyed function factory macro: must not be broken by the timeline wrapper
export const useApiData = createUseFetch(options => ({
  ...options,
  method: 'POST',
  body: { name: 'nuxt5' },
}))
