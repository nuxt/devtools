<a href="https://devtools.nuxtjs.org"><img width="1200" alt="Nuxt DevTools" src="https://user-images.githubusercontent.com/904724/217796838-597625f1-3f5a-4fb1-9720-68fd1c7d6615.jpg"></a>
<br>
<h1>
Nuxt DevTools <sup>Preview</sup>
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
  <a href="https://devtools.nuxtjs.org/">📚 Documentation</a>
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

Restart your Nuxt server and open your app in browser. Click the Nuxt icon on the bottom (or press <kbd>Shift</kbd> + <kbd>Alt</kbd> / <kbd>⇧ Shift</kbd> + <kbd>⌥ Option</kbd> + <kbd>D</kbd>) to toggle the DevTools.

> **Note**: If you using `nvm` or other Node version managers, we suggest to run the enable command again after switching Node version.

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

To configure Nuxt DevTools, you can pass the `devtools` options. 

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: [
    '@nuxt/devtools',
  ],
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

Please refer to the [Module Authors Guide](https://devtools.nuxtjs.org/module/guide).

## Contribution Guide

Please refer to the [Contribution Guide](https://devtools.nuxtjs.org/development/contributing).

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
