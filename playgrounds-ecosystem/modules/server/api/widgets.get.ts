// @scalar/nuxt renders its API reference (and its DevTools "Scalar" tab) from
// Nitro's auto-generated OpenAPI document. `defineRouteMeta({ openAPI: … })`
// annotates this endpoint so the generated spec — and therefore the Scalar
// tab — has a real, documented operation to display rather than an empty doc.
defineRouteMeta({
  openAPI: {
    tags: ['Widgets'],
    summary: 'List widgets',
    description: 'Returns the demo widgets used to give @scalar/nuxt a non-empty OpenAPI document.',
    responses: {
      200: {
        description: 'A list of widgets',
      },
    },
  },
})

export default defineEventHandler(() => {
  return [
    { id: 1, name: 'Gadget' },
    { id: 2, name: 'Gizmo' },
  ]
})
