import type { Component, NuxtOptions } from '@nuxt/schema'
import type { Import } from 'unimport'
import type { RouteRecordNormalized } from 'vue-router'

export interface ServerFunctions {
  getConfig(): NuxtOptions
  getComponents(): Component[]
  getAutoImports(): Import[]
  getPages(): RouteRecordNormalized[]
  getPayload(): Payload
  openInEditor(filepath: string): void
}

export interface ClientFunctions {
  refresh(type: string): void
}

export interface Payload {
  url: string
  time: number
  data?: Record<string, any>
  state?: Record<string, any>
  functions?: Record<string, any>
}
