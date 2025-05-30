import type { ElementTraceInfo } from 'vite-plugin-vue-tracer/client/record'

export interface NuxtCopilotProps {
  matched?: ElementTraceInfo
  mouse: { x: number, y: number }
}
