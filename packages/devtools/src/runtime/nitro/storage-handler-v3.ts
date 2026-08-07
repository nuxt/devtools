import { defineEventHandler, readBody } from 'nitro/h3'
import { useStorage } from 'nitro/storage'
// @ts-expect-error virtual module injected by @nuxt/devtools
import { token } from '#nuxt-devtools-storage'
import { handleStorageBridgeRequest } from './storage-bridge'

export default defineEventHandler(async (event) => {
  return handleStorageBridgeRequest(useStorage(), await readBody(event), token)
})
