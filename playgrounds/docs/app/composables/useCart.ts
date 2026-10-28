export function useCart() {
  const items = useState<number[]>('cart', () => [])

  return {
    items,
    count: computed(() => items.value.length),
    add: (id: number) => items.value.push(id),
  }
}
