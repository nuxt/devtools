import { defineHandler, readBody } from 'nitro/h3'
import { useStorage } from 'nitro/storage'

export default defineHandler(async (event) => {
  const { id } = await readBody<{ id: number }>(event) ?? {}
  const storage = useStorage('shop')
  const cart = [
    ...await storage.getItem<number[]>('cart') ?? [],
    id,
  ]
  await storage.setItem('cart', cart)
  return cart
})
