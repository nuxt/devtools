<img width="1200" alt="Nuxt DevTools" src="https://user-images.githubusercontent.com/11247099/215777354-7f04135e-a3c7-4ef2-880e-52d100b3fd33.png">

<br>
<br>

<h1 align="center">
Nuxt DevTools <sup>Preview</sup>
</h1>

<p align="center">
Unleash Nuxt Developer Experience.
<br>Nuxt DevTools is a set of visual tools that help you to know your app/site better.
</p>

<p align="center">
  <a href="https://github.com/nuxt/devtools/discussions/29">💡 Ideas & Suggestions</a> |
  <a href="https://github.com/nuxt/devtools/discussions/31">🗺️ Project Roadmap</a>
</p>

<br>

> **Warning**: Experimental and under heavy development. APIs are subject to change.

<br>

## Installation

> Nuxt DevTools requires **Nuxt v3.1.0 or higher**.

You can opt-in Nuxt DevTools per-project by going to the project root and run:

```bash
npx nuxi@latest enable devtools
```

Restart your Nuxt server and open your app in browser. Click the Nuxt icon on the bottom (or press `Alt+D`) to toggle the DevTools.

When you run `nuxi enable devtools`, Nuxt DevTools will be installed as a global module and only activated for the projects you enabled. The configuration will be saved in your local `~/.nuxtrc` file, so it doesn't affect your team unless they also opt-in.

Similarly, you can disable it per-project by running:

```bash
npx nuxi@latest disable devtools
```

### Install Manually

Nuxt DevTools is currently provided as a module (might be changed in the future). If you prefer, you can also install it locally, which will be activated for all your team members.

```bash
npm i -D @nuxt/devtools
```

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: [
    '@nuxt/devtools',
  ],
})
```

### Edge Release Channel

Similar to [Nuxt's Edge Channel](https://nuxt.com/docs/guide/going-further/edge-channel#opting-into-the-edge-channel), DevTools also offers an edge release channel, that automatically releases for every commit to `main` branch.

You can opt-in to the edge release channel by running:

```diff
{
  "devDependencies": {
--    "@nuxt/devtools": "^0.1.0"
++    "@nuxt/devtools": "npm:@nuxt/devtools-edge@latest"
  }
}
```

Remove lockfile (`package-lock.json`, `yarn.lock`, or `pnpm-lock.yaml`) and reinstall dependencies.

## Module Authors

Nuxt DevTools is designed to be extensible. You can add your own modules' integration to the DevTools.

> **Warning**: APIs are subject to change.

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
import { useDevtoolsClient } from '@nuxt/devtools/iframe-client'

export const devtoolsClient = useDevtoolsClient()
```

When the iframe been served with the same origin (CORS limitation), devtools will automatically inject `__NUXT_DEVTOOLS__` to the iframe's window object. You can access it as a ref using `useDevtoolsClient()` utility.

`devtoolsClient.value.host` contains APIs to communicate with the client app, and `devtoolsClient.value.devtools` contains APIs to communicate with the devtools. For example, you can get the router instance from the client app:

```ts
const router = computed(() => devtoolsClient.value?.host.nuxt.vueApp.config.globalProperties?.$router)
```

### Examples

- Built-in VS Code integration with lazy initialize: https://github.com/nuxt/devtools/blob/main/src/integrations/vscode.ts.
- VueUse adds a docs tab: https://github.com/vueuse/vueuse/blob/6158e660367b4417896926984670c5b91133c7c3/packages/nuxt/index.ts#L89-L99.
- UnoCSS Inspector: https://github.com/unocss/unocss/blob/25021a751494e99e85cfd82cca3855cdf78f6a12/packages/nuxt/src/index.ts#L81-L94
- Nuxt Vitest runner: https://github.com/danielroe/nuxt-vitest/blob/7bac68d96f27dea6c30c198b7caaaf0b495574ab/packages/nuxt-vitest/src/module.ts#L139-L181

## License

[MIT](./LICENSE)
