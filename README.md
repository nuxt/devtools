<img width="1200" alt="Nuxt DevTools" src="https://user-images.githubusercontent.com/904724/217796838-597625f1-3f5a-4fb1-9720-68fd1c7d6615.jpg">

<br>
<br>

<h1 align="center">
Nuxt DevTools <sup>Preview</sup>
</h1>

<p align="center">
Unleash Nuxt Developer Experience.
<br>Nuxt DevTools is a set of visual tools that help you to know your app better.
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
npx nuxi@latest devtools enable
```

Restart your Nuxt server and open your app in browser. Click the Nuxt icon on the bottom (or press <kbd>Alt</kbd> / <kbd>⌥ Option</kbd> + <kbd>D</kbd>) to toggle the DevTools.

When you run `nuxi devtools enable`, Nuxt DevTools will be installed as a global module and only activated for the projects you enabled. The configuration will be saved in your local `~/.nuxtrc` file, so it doesn't affect your team unless they also opt-in.

Similarly, you can disable it per-project by running:

```bash
npx nuxi@latest devtools disable
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


### Module Options
```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: [
    ['@nuxt/devtools', {
      enabled: true, // Enable devtools (default: true)
      vscode: {
        enabled: true, // Enable VS Code Server integration
        startOnBoot: false, // Start VS Code Server on boot (default: false)
        port: 8080, // VS Code Server port (default: 3080)
        reuseExistingServer: true // Reuse existing VS Code Server instance
      }
    }
    ]
  ]
})
```


## Features

Nuxt DevTools is a set of visual tools available **right inside your app**.

Here are a few of features preview. You can learn more in our [roadmap](https://github.com/nuxt/devtools/discussions/31).

###### Overview

Shows a quick overview of your app, including the Nuxt version, the pages, the components, the modules, and the plugins you are using. In the future we will add more, and allow you to upgrade your Nuxt with a single click.

<img width="1284" src="https://user-images.githubusercontent.com/11247099/217670797-12c33a03-ca4f-490d-a18a-ab9008b89c15.png">

###### Pages

Pages tab shows your current routes, and provide a quick way to navigate to them. You can also use the textbox to see how each route is matched.

<img width="1284" src="https://user-images.githubusercontent.com/11247099/217670804-e48482af-de37-47be-88d8-d9515e796d5f.png">


###### Components

Components tab show all the components you are using in your app and where they are from. You can also search for them and go to the source code.

<img width="1284" src="https://user-images.githubusercontent.com/11247099/217670805-726eafd1-5364-4b11-9c2b-9253d068e7e3.png">

The graph view also show the relationship beetwen components, and know the dependencies of each component.

<img width="1284" src="https://user-images.githubusercontent.com/11247099/217670806-fb39aeff-3881-44e5-b9c8-6c757f5925fc.png">

You can also inspect your app's DOM tree and see which component is rendering it. Find the place to make changes are much easier.

<img width="1284" src="https://user-images.githubusercontent.com/11247099/217670809-7dcb4198-5a74-4818-95b1-b62ea6c04a6c.png">

###### Imports

Imports tab shows all the auto-imports registered to Nuxt. You can see which files are importing them, and where they are from. Some entries can also provide short descriptions and documentation links.

<img width="1284" src="https://user-images.githubusercontent.com/11247099/217670811-fa7c7249-5a21-48c9-abe8-ca02b2518a3a.png">

###### Modules

Modules tab shows all the modules you have installed and the links to their documentation. In the future, we will try to provide a visual UI to install new modules with one-click.

<img width="1284" src="https://user-images.githubusercontent.com/11247099/217670813-ce3da4b6-269c-430e-abb5-a2263ffe4938.png">

###### Hooks

Hooks tab can help you to monitor the time spent in each hook. It can be helpful to find performance bottlenecks.

<img width="1284" src="https://user-images.githubusercontent.com/11247099/217670815-80ec0ec3-7df1-4a07-96fb-4161fb6562a7.png">

###### Virtual Files

Virtual Files tab shows the virtual files generated by Nuxt to support the conventions.

<img width="1284" src="https://user-images.githubusercontent.com/11247099/217670817-abb0315a-6d92-4c5e-a4da-2327f22e0e8b.png">

###### Inspect

Inspect expose the [`vite-plugin-inspect`](https://github.com/antfu/vite-plugin-inspect) integration, allowing you to inspect transformation steps of Vite.

<img width="1284" src="https://user-images.githubusercontent.com/11247099/217670818-77f91135-7318-462e-9148-4ad504c82555.png">

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
const router = computed(() => devtoolsClient.value?.host?.nuxt.vueApp.config.globalProperties?.$router)
```

### Examples

- Built-in VS Code integration with lazy initialize: https://github.com/nuxt/devtools/blob/main/src/integrations/vscode.ts.
- VueUse adds a docs tab: https://github.com/vueuse/vueuse/blob/6158e660367b4417896926984670c5b91133c7c3/packages/nuxt/index.ts#L89-L99.
- UnoCSS Inspector: https://github.com/unocss/unocss/blob/25021a751494e99e85cfd82cca3855cdf78f6a12/packages/nuxt/src/index.ts#L81-L94
- Nuxt Vitest runner: https://github.com/danielroe/nuxt-vitest/blob/7bac68d96f27dea6c30c198b7caaaf0b495574ab/packages/nuxt-vitest/src/module.ts#L139-L181
- Nuxt OG Image Playground: https://github.com/harlan-zw/nuxt-og-image/blob/main/src/module.ts#L136

## License

[MIT](./LICENSE)
