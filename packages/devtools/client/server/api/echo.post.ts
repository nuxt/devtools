import { defineEventHandler, readBody } from 'h3'

export default defineEventHandler(async (ctx) => {
  const body = await readBody<Record<string, unknown>>(ctx)
  return {
    ...body,
  }
})
