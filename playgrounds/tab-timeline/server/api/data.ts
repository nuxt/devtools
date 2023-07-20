export default defineEventHandler(async (ctx) => {
  const body = await readBody(ctx)

  await new Promise(resolve => setTimeout(resolve, Math.random() * 2000 + 100))

  return {
    msg: `Hello ${body.name}`,
  }
})
