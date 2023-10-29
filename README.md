<a href="https://devtools.nuxt.com"><img width="1200" alt="Nuxt DevTools" src="https://github-production-user-asset-6210df.s3.amazonaws.com/904724/261577617-a10567bd-ad33-48cc-9bda-9e37dbe1929f.png"></a>
<br>
<h1>
Nuxt DevTools
</h1>

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![License][license-src]][license-href]
[![Nuxt][nuxt-src]][nuxt-href]
[![Volta][volta-src]][volta-href]

<p>
Unleash Nuxt Developer Experience.
<br>Nuxt DevTools is a set of visual tools that help you to know your app better.
</p>

<p>
  <a href="https://github.com/nuxt/devtools/discussions/29">💡 Ideas & Suggestions</a> |
  <a href="https://github.com/nuxt/devtools/discussions/31">🗺️ Project Roadmap</a> |
  <a href="https://devtools.nuxt.com/">📚 Documentation</a>
</p>

<br>

## Installation

> Nuxt DevTools requires **Nuxt v3.1.0 or higher**.

Nuxt DevTools is **enabled by default** in Nuxt v3.8.0. You can press <kbd>Shift</kbd> + <kbd>Alt</kbd> / <kbd>⇧ Shift</kbd> + <kbd>⌥ Option</kbd> + <kbd>D</kbd> in your app to open it up.

If you want to explicitly enable or disable Nuxt DevTools, you can update your `nuxt.config` with:

```js
export default defineNuxtConfig({
  devtools: {
    enabled: true // or false to disable
  }
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

To configure Nuxt DevTools, you can pass the `devtools` options. 

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  devtools: {
    // Enable devtools (default: true)
    enabled: true,
    // VS Code Server options
    vscode: {},
    // ...other options
  }
})
```

For all options available, please refer to TSDocs in your IDE, or the [type definition file](https://github.com/nuxt/devtools/blob/main/packages/devtools-kit/src/_types/options.ts).

## Features

Read the [**Announcement Blog Post 🎊**](https://nuxt.com/blog/introducing-nuxt-devtools) for why we built Nuxt DevTools and what it can do!

## Module Authors

Please refer to the [Module Authors Guide](https://devtools.nuxt.com/module/guide).

## Contribution Guide

Please refer to the [Contribution Guide](https://devtools.nuxt.com/development/contributing).

## Anonymous Usage Analytics

Nuxt DevTools collects anonymous telemetry data about general usage. This helps us to accurately gauge feature usage and customization across all our users. This data will let us better understand how each features in Nuxt DevTools are used, measuring improvements made (DX and performances) and their relevance. It would also help us to prioritize our efforts and focus on the features that matter the most to our users.

Nuxt DevTools' telemetry data is piped through [Nuxt Telemetry](https://github.com/nuxt/telemetry), meaning that Nuxt DevTools will respect your local and global Nuxt Telemetry settings. You can also opt-out Nuxt DevTools' telemetry in the Nuxt DevTools settings.

The data we collect is completely anonymous, not traceable to the source (using hash+seed), and only meaningful in aggregate form. No data we collect is personally identifiable or trackable.

### Events

On top of the [default Nuxt Telemetry events](https://github.com/nuxt/telemetry#events), Nuxt DevTools also collects the following events:

- Versions of Nuxt DevTools
- Navigations between tabs/feature
  - This helps us to understand which features are used the most to prioritize our efforts.
- Browser and OS names and versions
  - This helps us improve compatibility across different browsers and operating systems.
- Click event on some action buttons

## License

[MIT](./LICENSE)


<!-- Badges -->
[npm-version-src]: https://img.shields.io/npm/v/@nuxt/devtools/latest.svg?style=flat&colorA=18181B&colorB=28CF8D
[npm-version-href]: https://npmjs.com/package/@nuxt/devtools

[npm-downloads-src]: https://img.shields.io/npm/dt/@nuxt/devtools.svg?style=flat&colorA=18181B&colorB=28CF8D
[npm-downloads-href]: https://npmjs.com/package/@nuxt/devtools

[license-src]: https://img.shields.io/npm/l/@nuxt/devtools.svg?style=flat&colorA=18181B&colorB=28CF8D
[license-href]: https://npmjs.com/package/@nuxt/devtools

[nuxt-src]: https://img.shields.io/badge/Nuxt-18181B?logo=nuxt.js
[nuxt-href]: https://nuxt.com

[volta-src]: https://user-images.githubusercontent.com/904724/209143798-32345f6c-3cf8-4e06-9659-f4ace4a6acde.svg
[volta-href]: https://volta.net/nuxt/devtools?utm_source=nuxt_devtools_readme
