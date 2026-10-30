import { useStorage } from 'nitro/storage'
import { defineTask } from 'nitro/task'
import { products } from '../../utils/products'

export default defineTask({
  meta: {
    name: 'products:sync',
    description: 'Sync the product catalog from the warehouse',
  },
  async run() {
    await useStorage('shop').setItem('products', products)
    return { result: `${products.length} products synced` }
  },
})
