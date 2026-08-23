import { defineEventHandler } from 'h3'

export default defineEventHandler(() => {
  return {
    msg: 'Hello World!',
  }
})
