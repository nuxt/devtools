import type { ElementTraceInfo } from 'vite-plugin-vue-tracer/client/record'

export interface NuxtDevToolsInspectorProps {
  matched?: ElementTraceInfo
  hasParent?: boolean
  mouse: { x: number, y: number }
}
