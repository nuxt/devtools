import { copyFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const dir = fileURLToPath(new URL('..', import.meta.url))
copyFileSync(resolve(dir, '../../README.md'), resolve(dir, './README.md'))
