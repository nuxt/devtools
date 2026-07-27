export default defineEventHandler(async (ctx) => {
  const body = await readBody<Record<string, unknown>>(ctx)
  return {
    ...body,
  }
})
