export function useProducts() {
  return useFetch('/api/products', { key: 'products' })
}
