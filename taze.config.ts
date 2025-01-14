import { defineConfig } from 'taze'

export default defineConfig({
  exclude: [
    'execa', // Node compatibility,
    'which', // Node compatibility,
  ],
  ignorePaths: [
    'clones',
  ],
})
