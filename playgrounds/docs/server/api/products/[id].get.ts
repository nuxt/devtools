import { defineHandler, getRouterParam, HTTPError } from 'nitro/h3'
import { products } from '../../utils/products'

export default defineHandler(async (event) => {
  // A warehouse lookup, slow enough for the Timeline tab to show the request.
  await new Promise(resolve => setTimeout(resolve, 600))

  const id = Number(getRouterParam(event, 'id'))
  const product = products.find(product => product.id === id)
  if (!product)
    throw new HTTPError({ status: 404, statusText: 'Product not found' })
  return product
})
