# Nuxt UI Components

<a href="https://www.npmjs.com/package/@nuxt/ui-edge"><img src="https://flat.badgen.net/npm/v/@nuxt/ui-edge"></a>

UI kit for Nuxt 3's examples and internal tooling UI.

> Note: This library is heavily working in progress and does not serve as a generic UI library (for now). It is not recommended to use it in production.

🏀 [Online Playground](https://components.ui.nuxtjs.org)

## Install

```ts
// nuxt.config.js
import { defineNuxtConfig } from 'nuxt'

export default defineNuxtConfig({
  modules: [
    '@nuxt/ui'
  ]
})
```

## Usage

Nuxt UI is an unbundled component library powered by [UnoCSS](https://github.com/antfu/unocss) and [VueUse](https://vueuse.org/).

In Nuxt UI, we introduced the `n` attribute for every component to customize the styles and variations. For example, to make a red button:

```html
<NButton n="red" />
```

to make it larger, add the size specifier (`sm`, `md`, `lg` or `xl`) the `n` attribute:

```html
<NButton n="red xl" />
```

You can apply the same specifiers to any other component, for example:

```html
<NCheckbox n="red xl" />
```

Apply it to parent components could make a local theme scope

```html
<NCard n="green-500">
  <!-- both of them are themed green -->
  <NCheckbox>i accept the terms & conditions</NCheckbox>
  <NButton>Submit</NButton>
</NCard>
```

## Theming

Powered by [UnoCSS](https://github.com/antfu/unocss), you can use Tailwind/Windi CSS utilities to quickly customize the look and feel of components.

It's also possible to override the default theme globally, for example:

```ts
// nuxt.config.js
import { defineNuxtConfig } from 'nuxt'

export default defineNuxtConfig({
  modules: [
    '@nuxt/ui'
  ],
  unocss: {
    shortcuts: {
      'n-button-base': 'border n-border-base rounded shadow-sm op80 !outline-none',
      'n-button-hover': 'op100 !border-context text-context',
      'n-button-active': 'n-active-base bg-context/5',
    }
  }
})
```

You can find all the default values and available entries in [src/unocss/index.ts](./src/unocss/index.ts).
