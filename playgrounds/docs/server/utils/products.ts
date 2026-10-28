export interface Product {
  id: number
  name: string
  description: string
  price: number
}

export const products: Product[] = [
  {
    id: 1,
    name: 'Nuxt T-Shirt',
    description: 'Organic cotton, with the Nuxt logo.',
    price: 25,
  },
  {
    id: 2,
    name: 'Vue Mug',
    description: 'For your morning coffee.',
    price: 14,
  },
  {
    id: 3,
    name: 'Sticker Pack',
    description: 'Twelve stickers for your laptop.',
    price: 6,
  },
  {
    id: 4,
    name: 'Nitro Hoodie',
    description: 'Warm and fast.',
    price: 49,
  },
  {
    id: 5,
    name: 'Vite Cap',
    description: 'Lightning on your head.',
    price: 19,
  },
  {
    id: 6,
    name: 'DevTools Notebook',
    description: 'Write down what you found.',
    price: 9,
  },
]
