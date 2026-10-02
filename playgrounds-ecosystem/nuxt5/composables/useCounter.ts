export function useCounter(key = 'counter') {
  const count = useState(key, () => 0)
  const inc = () => count.value++
  const dec = () => count.value--
  const reset = () => count.value = 0
  return { count, inc, dec, reset }
}
