// A plain handler (no `nitro/h3` import) keeps this working under the dev server's module runner.
export default async function dataHandler(event: { req: Request }) {
  const body: { name?: string } = await event.req.json().catch(() => ({}))
  await new Promise(resolve => setTimeout(resolve, Math.random() * 1500 + 100))
  return { msg: `Hello ${body.name ?? 'world'}` }
}
