export default defineEventHandler((ctx) => {
  return ctx.node.req.read()
})
