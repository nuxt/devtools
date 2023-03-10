import { createH3StorageHandler } from 'unstorage/server'
import type { H3Event } from 'h3'
import { eventHandler, useStorage } from '#imports'

const handler = createH3StorageHandler(useStorage())

export default eventHandler((event: H3Event) => {
  if (event.node?.req?.url)
    event.node.req.url = event.node.req.url.replace(/^\/_devtools_storage/, '')
  return handler(event)
})
