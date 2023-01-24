# Nuxt DevTools <sup>Alpha Preview</sup>

Tools to enhance your development experience with Nuxt. Transparent, informative, extensible and joyful.

> **Note**: Experimental and under heavy development. APIs are subject to change.

## Installation

Nuxt DevTools is currently only available in edge versions (releases on every commit to `main`).

Requires Nuxt 3.1.0 or higher.

```bash
npm i -D @nuxt/devtools-edge
```

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: [
    '@nuxt/devtools-edge',
  ],
})
```

Then open your app in browser. Click the Nuxt icon on the bottom to open the DevTools.

## Module Authors

Nuxt DevTools is designed to be extensible. You can add your own modules's integration to the DevTools.

> **Warning**: API and subject to change.

### Contributing to View

Currently the only way to contribute to Nuxt DevTools View is via iframe. You need to serve your module's view yourself and then register it to the DevTools.

```ts
nuxt.hook('devtools:customTabs', (tabs) => {
  tabs.push({
    name: 'my-module',
    title: 'My Module',
    icon: 'carbon:apps', // any icon name from Iconify
    view: {
      type: 'iframe',
      src: '/url-to-your-module-view',
    },
  })
})
```

## License

[MIT](./LICENSE)
