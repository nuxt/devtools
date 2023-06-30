export default defineEventHandler(async (ctx) => {
  const body = await readBody(ctx)
  return {
    ...body,
  }
})
