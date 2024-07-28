import { defineConfig } from 'taze'

export default defineConfig({
  exclude: [
    'execa', // Node compatibility,
    'which', // Node compatibility,

    // Since v0.6.0, the runtime extension is not compatible with our usage to share the code for both the client and the server.
    '@nuxt/module-builder',
  ],
  ignorePaths: [
    'clones',
  ],
})
