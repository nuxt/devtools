import { resolve } from 'path'
import { fileURLToPath } from 'url'

export const runtimeDir = resolve(fileURLToPath(import.meta.url), '../runtime')
export const clientDir = resolve(fileURLToPath(import.meta.url), '../client')
