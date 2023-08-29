import { defineConfig } from 'taze'

export default defineConfig({
  exclude: [
    'execa', // Node compatibility,
    'unbuild', // Waiting for https://github.com/nuxt/module-builder/pull/161
  ],
  ignorePaths: [
    'clones',
  ],
})
