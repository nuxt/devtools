import fs from 'node:fs/promises'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { codegen } from 'shiki-codegen'

const dir = fileURLToPath(new URL('..', import.meta.url))
await fs.copyFile(resolve(dir, '../../README.md'), resolve(dir, './README.md'))

const { code } = await codegen({
  themes: [
    'vitesse-dark',
    'vitesse-light',
  ],
  langs: [
    'json',
    'yaml',
    'css',
    'javascript',
    'typescript',
    'vue',
    'vue-html',
    'html',
    'diff',
    'shellscript',
  ],
  precompiled: false,
  engine: 'javascript',
  typescript: true,
  header: [
    '/* Generate by @shikijs/codegen */',
    '/* eslint-disable eslint-comments/no-unlimited-disable */',
    '/* eslint-disable */',
  ].join('\n'),
})

await fs.writeFile(resolve(dir, 'client/composables/client-services/shiki.bundle.ts'), code, 'utf-8')
