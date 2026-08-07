import { defineEventHandler, readBody } from 'h3'
import { useStorage } from 'nitropack/runtime'
// @ts-expect-error virtual module injected by @nuxt/devtools
import { token } from '#nuxt-devtools-storage'
import { handleStorageBridgeRequest } from './storage-bridge'

export default defineEventHandler(async (event) => {
  return handleStorageBridgeRequest(useStorage(), await readBody(event), token)
})
