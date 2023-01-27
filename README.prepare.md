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
    // unique identifier
    name: 'my-module',
    // title to display in the tab
    title: 'My Module',
    // any icon from Iconify, or a URL to an image
    icon: 'carbon:apps',
    // iframe view
    view: {
      type: 'iframe',
      src: '/url-to-your-module-view',
    },
  })
})
```

### Lazy Service Launching

If the view you are contributing is heavy to load, you can have the tab first and let user launch it when they need it.

```ts
let isReady = false
const promise: Promise<any> | null = null

async function launchService() {
  // ...launch your service
  isReady = true
}

nuxt.hook('devtools:customTabs', (tabs) => {
  tabs.push({
    name: 'my-module',
    title: 'My Module',
    view: isReady
      ? {
          type: 'iframe',
          src: '/url-to-your-module-view',
        }
      : {
          type: 'launch',
          description: 'Launch My Module',
          actions: [{
            label: 'Start',
            async handle() {
              if (!promise)
                promise = launchService()
              await promise
            },
          }]
        },
  })
})
```

It will first display a launch page with a button to start the service. When user click the button, the `handle()` will be called, and the view will be updated to iframe.

When you need to refresh the custom tabs, you can call `nuxt.callHook('devtools:customTabs:refresh')` and the hooks on `devtools:customTabs` will be revaluated again.

### DevTools API from Custom View

To provide complex interactions for your module integrations, we recommend to host your own view and display it in devtools via iframe.

To get the infomation from the devtools and the client app, you can do this in your client app:

```ts
import { useDevtoolsClient } from '@nuxt/devtools-edge/iframe-client'

export const devtoolsClient = useDevtoolsClient()
```

When the iframe been served with the same origin (CORS limitation), devtools will automatically inject `__NUXT_DEVTOOLS__` to the iframe's window object. You can access it as a ref using `useDevtoolsClient()` utility.

`devtoolsClient.value.host` contains APIs to communicate with the client app, and `devtoolsClient.value.devtools` contains APIs to communicate with the devtools. For example, you can get the router instance from the client app:

```ts
const router = computed(() => devtoolsClient.value?.host.nuxt.vueApp.config.globalProperties?.$router)
```

## License

[MIT](./LICENSE)
