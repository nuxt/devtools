import { NuxtUIPreset } from '@nuxt/ui/unocss'
import { defineConfig, presetAttributify, presetIcons, presetUno, presetWebFonts, transformerDirectives } from 'unocss'
// @ts-expect-error missing types

export default defineConfig({
  shortcuts: [
    {
      // General Tokens
      'border-base': 'border-gray/20',
      'bg-base': 'bg-white dark:bg-[#151515]',
      'bg-active': 'bg-gray:5',
      'navbar-glass': 'sticky z-10 top-0 backdrop-blur bg-white/70 dark:bg-[#151515]/70',

      // Nuxt UI Custom
      'n-bg-base': 'bg-base',
      'n-border-base': 'border-base',

      'n-icon-btn': 'aspect-1/1 w-1.6em h-1.6em flex items-center justify-center rounded op50 hover:op100 hover:bg-active',

      // Reusable
      'x-divider': 'h-1px w-full bg-gray/15',
    },
    [/^theme-banner-(\w+)$/, $ => `p2 flex gap2 items-center rounded bg-${$[1]}:5 text-${$[1]}6`],
    [/^theme-card-(\w+)$/, $ => `p2 flex gap2 items-center rounded min-w-40 min-h-30 justify-center transition-all saturate-0 bg-gray/10 op50 hover:(op100 bg-${$[1]}/10 text-${$[1]}6 saturate-100)`],
  ],
  theme: {
    colors: {
      primary: '#03ae67',
    },
  },
  presets: [
    presetUno(),
    presetAttributify(),
    presetIcons({
      prefix: ['i-', ''],
      scale: 1.2,
      extraProperties: {
        'display': 'inline-block',
        'vertical-align': 'middle',
      },
    }),
    presetWebFonts({
      fonts: {
        sans: 'Inter:400,500',
        mono: 'Fira Code',
      },
    }),
    NuxtUIPreset(),
  ],
  safelist: [
    'carbon-nominal',
    'carbon-function',
    'carbon-chart-treemap',
    'carbon-3d-mpr-toggle',
    'carbon-tree-view-alt',
    'carbon-information',
    'carbon-data-set',
    'carbon-layers',
    'carbon-cloud',
    'carbon-plug',
  ],
  transformers: [
    transformerDirectives(),
  ],
})
