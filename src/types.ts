import type { Component, NuxtOptions } from '@nuxt/schema'
import type { Import } from 'unimport'

export interface ServerFunctions {
  getConfig(): NuxtOptions
  getComponents(): Component[]
  getAutoImports(): Import[]
}
