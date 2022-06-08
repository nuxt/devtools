import type { Component, NuxtOptions } from '@nuxt/schema'
import type { Import } from 'unimport'

export interface ServerFunctions {
  getConfig(): NuxtOptions
  getComponents(): Component[]
  getAutoImports(): Import[]
  getPayload(): Payload
  openInEditor(filepath: string): void
}

export interface Payload {
  url: string
  time: number
  data?: Record<string, any>
  state?: Record<string, any>
  functions?: Record<string, any>
}
