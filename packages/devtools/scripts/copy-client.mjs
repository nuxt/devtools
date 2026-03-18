import { cpSync } from 'node:fs'

cpSync('client/.output/public', 'dist/client', { recursive: true })
