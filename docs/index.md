---
title: Nuxt DevTools
description: 'Insights and transparency about your Nuxt app, right in the Vite DevTools panel.'
navigation:
  title: Quick Start
---

Nuxt DevTools shows you how your Nuxt app is put together: its pages, components, auto-imports, modules, server routes, payloads and configuration. It lives as a `Nuxt` group inside the [Vite DevTools](https://github.com/vitejs/devtools) panel, next to Vue DevTools, Inspect, Terminals and the tools your other Vite plugins provide.

![The Nuxt DevTools Overview in the Vite DevTools panel](./images/overview.webp)

## Requirements

Nuxt DevTools v4 needs **Vite 8**, so **Nuxt 5**, or **Nuxt 4.5 or later**. Nuxt 4.0–4.4 ship Vite 7 and cannot run it; see [Upgrading to v4](/modules/devtools/upgrading-to-v4) if you are coming from v3.

## Installation

### Nuxt 5

Nuxt 5 ships [`@nuxt/devtools-onboard`](https://github.com/nuxt/devtools/tree/main/packages/devtools-onboard), a tiny module that loads Nuxt DevTools when it is installed. The first time you run `nuxt dev` without it, a floating button offers to install `@nuxt/devtools` with your package manager and restarts the dev server. Each install waits for you to confirm it in the terminal running `nuxt dev`.

You can also install it yourself:

```bash
npm i -D @nuxt/devtools
```

### Nuxt 4.5+

Nuxt 4 still bundles DevTools v3. Override the bundled version with your package manager, then reinstall:

::code-group

```json [npm]
{
  "overrides": {
    "@nuxt/devtools": "^4.0.0"
  }
}
```

```json [yarn]
{
  "resolutions": {
    "@nuxt/devtools": "^4.0.0"
  }
}
```

```yaml [pnpm]
# pnpm-workspace.yaml
overrides:
  '@nuxt/devtools': ^4.0.0
```

::

Remove your lockfile (`package-lock.json`, `yarn.lock`, or `pnpm-lock.yaml`) and install again so the override takes effect.

### Turning it off

DevTools is enabled by default in development, and nothing is injected in production. To turn it off, set `enabled` to `false`:

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  devtools: { enabled: false },
})
```

## Opening the DevTools

Run `nuxt dev` and open your app in the browser. Click the **Nuxt** button in the Vite DevTools dock at the bottom of the page, or press :kbd{value="Shift"} + :kbd{value="Alt"} / :kbd{value="⇧ Shift"} + :kbd{value="⌥ Option"} + :kbd{value="D"}, to toggle the panel.

Vite DevTools can run commands and read files on your machine, so the first time you open it, it asks you to **authorize the browser** with the code printed in the terminal running `nuxt dev`. The prompt is skipped in sandboxes such as StackBlitz and CodeSandbox. To skip it elsewhere, set `devtools.disableAuthorization: true`; only do this on a machine you trust, as any browser that reaches the dev server then gets access.

## Module Options

Configure Nuxt DevTools with the `devtools` key of your `nuxt.config`:

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  devtools: {
    // Enable DevTools (default: true)
    enabled: true,
    // Coder code-server integration (default: enabled, launched on demand)
    codeServer: {},
    // Record composable calls and route changes in the Timeline tab (default: false)
    timeline: { enabled: true },
  },
})
```

| Option                    | Default  | Description                                                                                                   |
| ------------------------- | -------- | ------------------------------------------------------------------------------------------------------------- |
| `enabled`                 | `true`   | Enable Nuxt DevTools.                                                                                         |
| `componentInspector`      | `true`   | Inspect the DOM to find the component rendering it.                                                           |
| `vueDevTools`             | `true`   | Register the Vue DevTools dock next to the `Nuxt` group.                                                      |
| `viteInspect`             | `true`   | Register the [Inspect](/modules/devtools/features#inspect) dock, or its install launcher.                     |
| `dataInspector`           | `true`   | Register the [Data Inspector](/modules/devtools/features#data-inspector) panel.                               |
| `codeServer`              |          | [Code Server](/modules/devtools/features#code-server) options; `codeServer.enabled: false` removes it.        |
| `timeline`                |          | [Timeline](/modules/devtools/features#timeline) options; `timeline.enabled` defaults to `false`.              |
| `assets.uploadExtensions` |          | File extensions the [Assets](/modules/devtools/features#assets) panel accepts for upload, or `'*'` for any.   |
| `disableAuthorization`    |          | Skip the browser authorization prompt. On by default in sandboxes.                                            |
| `mcp`                     | `'auto'` | Expose the Vite DevTools [MCP](https://modelcontextprotocol.io) endpoint for AI agents; `false` turns it off. |
| `telemetry`               |          | Anonymous telemetry. Follows your Nuxt telemetry setting; set to `false` to opt out.                          |

For every option, see the TSDocs in your IDE or the [type definition file](https://github.com/nuxt/devtools/blob/main/packages/devtools-kit/src/_types/options.ts).

## Nightly Release Channel

Similar to [Nuxt's Nightly Channel](/docs/guide/going-further/nightly-release-channel), DevTools also offers a nightly release channel, that automatically releases for every commit to the `main` branch.

On Nuxt 5, install it next to your app's dependencies; it takes precedence over `@nuxt/devtools`:

```bash
npm i -D @nuxt/devtools-nightly
```

If your `nuxt.config` lists `@nuxt/devtools` in `modules`, replace it with `@nuxt/devtools-nightly`.

On Nuxt 4, alias it with your package manager's overrides:

::code-group

```json [npm]
{
  "overrides": {
    "@nuxt/devtools": "npm:@nuxt/devtools-nightly@latest"
  }
}
```

```json [yarn]
{
  "resolutions": {
    "@nuxt/devtools": "npm:@nuxt/devtools-nightly@latest"
  }
}
```

```yaml [pnpm]
# pnpm-workspace.yaml
overrides:
  '@nuxt/devtools': 'npm:@nuxt/devtools-nightly@latest'
```

::

Remove your lockfile (`package-lock.json`, `yarn.lock`, or `pnpm-lock.yaml`) and reinstall dependencies.
