import { defineHandler } from 'nitro/h3'
import { products } from '../../utils/products'

export default defineHandler(() => products)
