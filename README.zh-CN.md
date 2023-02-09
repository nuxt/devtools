<img width="1200" alt="Nuxt DevTools" src="https://user-images.githubusercontent.com/904724/217796838-597625f1-3f5a-4fb1-9720-68fd1c7d6615.jpg">

<br>
<br>

<h1 align="center">
Nuxt DevTools <sup>Preview</sup>
</h1>

<p align="center">
Unleash Nuxt Developer Experience.
<br>Nuxt DevTools 是一个应用于 Nuxt 应用的可视化工具，它能够帮助开发者更好的了解与分析应用.
</p>

<p align="center">
  <a href="https://github.com/nuxt/devtools/discussions/29">💡 想法 & 建议</a> |
  <a href="https://github.com/nuxt/devtools/discussions/31">🗺️ 路线图</a>
</p>

<br>

> **Warning**: 项目正在积极的开发与推进中，目前还处于试验性阶段. APIs 可能会发生改变.

<br>

## Installation

> Nuxt DevTools 要求 **Nuxt v3.1.0 或 更高版本**.

您可以在您的 Nuxt 项目的根目录中运行以下指令来使用 Nuxt DevTools。

```bash
npx nuxi@latest devtools enable
```
重启您的 Nuxt 服务并在浏览器中打开应用，点击下方出现的 Nuxt 图标（或按下 `Alt+D`）来呼出 Nuxt DevTools。

当您运行命令 `nuxi devtools enable` 时，Nuxt DevTools 将被作为全局模块安装，但是它只会在您指定开启的 Nuxt 项目中激活。这个配置存储在本地 `~/.nuxtrc` 文件中。因此，您不必担心它会作为依赖被安装从而导致您的工作团队依赖受到影响。

同样您也可以通过以下命令来在您的项目中禁用 Nuxt DevTools。

```bash
npx nuxi@latest devtools disable
```

### Install Manually

Nuxt DevTools 当前被作为一个依赖模块供开发者使用（未来或许会有其他变化），但如果您愿意，它同样可以手动安装到您的项目本地依赖中，那么，在您团队的每个成员本地运行项目时它都将被激活使用。

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

### Edge Release Channel TODO
与 Nuxt 的 [Nuxt's Edge Channel](https://nuxt.com/docs/guide/going-further/edge-channel#opting-into-the-edge-channel) 类似，
DevTools 还提供了一个 `edge release channel`，使用它后在您使用 DevTools 时 DevTools 将不再是某个固定的版本，而是以 main 分支在每次被合并后的最新代码作为版本。
这样您所使用的 DevTools 总能够与 main 分支同步，而不需要等到某个固定版本发布。

通过如下配置，你可以使用 DevTools 的 `edge release channel`

```diff
{
  "devDependencies": {
--    "@nuxt/devtools": "^0.1.0"
++    "@nuxt/devtools": "npm:@nuxt/devtools-edge@latest"
  }
}
```

删除版本锁定文件(`package-lock.json`, `yarn.lock`, or `pnpm-lock.yaml`)并重新安装依赖。

## Features

NuxtDevTools 是一组可视化工具，可以直接在您的应用程序中使用。
这里我们向您展示它的一些特性，您可以在我们的路线图](https://github.com/nuxt/devtools/discussions/31)中了解更多支持的特性。

###### Overview

应用总览展示，包括 Nuxt 版本、页面内容、组件信息以及模块、依赖和使用的插件等，在未来我们将支持更多的信息展示，并且允许您通过点击来变更应用 Nuxt 版本。

<img width="1284" src="https://user-images.githubusercontent.com/11247099/217670797-12c33a03-ca4f-490d-a18a-ab9008b89c15.png">

###### Pages

页面选项向您展示了当前激活的路由，并提供了向其他路由导航跳转的快捷方法，您也可以通过文本框来查看路由的匹配情况。

<img width="1284" src="https://user-images.githubusercontent.com/11247099/217670804-e48482af-de37-47be-88d8-d9515e796d5f.png">


###### Components

组件选项向您展示了应用所使用的组件以及他们的所在位置。您可以对组件进行检索，并跳转到源码。

<img width="1284" src="https://user-images.githubusercontent.com/11247099/217670805-726eafd1-5364-4b11-9c2b-9253d068e7e3.png">

通过力导图展示组件之间的关系，帮助您了解组件之间的依赖关系。

<img width="1284" src="https://user-images.githubusercontent.com/11247099/217670806-fb39aeff-3881-44e5-b9c8-6c757f5925fc.png">

您还可以检查应用程序的 DOM 树，并查看哪个组件正在呈现它。更加容易定位是那个组件在改变 DOM。

<img width="1284" src="https://user-images.githubusercontent.com/11247099/217670809-7dcb4198-5a74-4818-95b1-b62ea6c04a6c.png">

###### Imports

导入选项向您展示了所有自动导入并注册到 Nuxt 的导入方法、变量等。您可以看到哪些文件使用了他们，以及他们来自哪里。
此外，被导入的某些变量或方法还可以提供简短的描述和文档链接。

<img width="1284" src="https://user-images.githubusercontent.com/11247099/217670811-fa7c7249-5a21-48c9-abe8-ca02b2518a3a.png">

###### Modules

依赖模块选项向您展示了您安装了哪些依赖模块并提供了文档链接，在未来我们将尝试提供一个可视化的UI界面来让您能够通过点击快捷安装新的依赖模块。

<img width="1284" src="https://user-images.githubusercontent.com/11247099/217670813-ce3da4b6-269c-430e-abb5-a2263ffe4938.png">

###### Hooks

钩子选项可以帮助您监视每个钩子花费的时间。它有助于找到性能瓶颈。

<img width="1284" src="https://user-images.githubusercontent.com/11247099/217670815-80ec0ec3-7df1-4a07-96fb-4161fb6562a7.png">

###### Virtual Files

虚拟文件选项能够展示由 Nuxt 生成的符合规范的虚拟文件。

<img width="1284" src="https://user-images.githubusercontent.com/11247099/217670817-abb0315a-6d92-4c5e-a4da-2327f22e0e8b.png">

###### Inspect

集成了[`vite-plugin-inspect`](https://github.com/antfu/vite-plugin-inspect)，它能够运行您查看 Vite 的转换步骤详情。

<img width="1284" src="https://user-images.githubusercontent.com/11247099/217670818-77f91135-7318-462e-9148-4ad504c82555.png">

## Module Authors

Nuxt DevTools 被设计成可扩展的。您可以将自己的模块集成到 DevTools 中。

> **Warning**: APIs 可能会改变。

### Contributing to View

目前，对Nuxt DevTools 视图做出自定义的唯一方法是通过 iframe。您需要自己定义模块的视图，然后将其注册到 DevTools。

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

如果您提供的视图载入缓慢且沉重，那么您可以先使用选项卡，让用户在需要时启动它。

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

它将首先显示一个带有启动服务按钮的启动页面。当用户单击按钮时，将调用`handle()`，并将视图更新为 iframe。

当需要刷新自定义选项卡时，可以调用 `nuxt.callHook('devtools:customTabs:refresh')` ，`devtools:customTabs` 上的钩子将再次被重新调用。

### DevTools API from Custom View

为了为您的模块集成提供复杂的交互，我们建议托管您自己的视图，并通过 iframe 在 devtools 中显示它。

要 devtools 和客户端应用之间进行数据交互，可以在客户端应用中完成此操作：

```ts
import { useDevtoolsClient } from '@nuxt/devtools/iframe-client'

export const devtoolsClient = useDevtoolsClient()
```
当 iframe 以同源(CORS 限制)提供服务时，devtools 将自动向 iframe 的 window 对象注入 `__NUXT_DEVTOOLS__`。您可以使用 `useDevtoolsClient()` 实用工具作为参考访问它。

`devtoolsClient.value.host`中包含了用于与客户端应用通信的相关 APIs，而 `devtoolsClient.value.devtools` 中则包含有用于与 devtools 通信相关的 APIs。例如，如果您想获得客户端应用的路由实例对象，您可以这么做：

```ts
const router = computed(() => devtoolsClient.value?.host?.nuxt.vueApp.config.globalProperties?.$router)
```

### Examples

- Built-in VS Code integration with lazy initialize: https://github.com/nuxt/devtools/blob/main/src/integrations/vscode.ts.
- VueUse adds a docs tab: https://github.com/vueuse/vueuse/blob/6158e660367b4417896926984670c5b91133c7c3/packages/nuxt/index.ts#L89-L99.
- UnoCSS Inspector: https://github.com/unocss/unocss/blob/25021a751494e99e85cfd82cca3855cdf78f6a12/packages/nuxt/src/index.ts#L81-L94
- Nuxt Vitest runner: https://github.com/danielroe/nuxt-vitest/blob/7bac68d96f27dea6c30c198b7caaaf0b495574ab/packages/nuxt-vitest/src/module.ts#L139-L181

## License

[MIT](./LICENSE)
