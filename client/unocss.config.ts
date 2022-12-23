import { defineConfig, presetAttributify, presetIcons, presetUno, presetWebFonts, transformerDirectives } from 'unocss'
import { NuxtUIPreset } from '@nuxt/ui/unocss'

export default defineConfig({
  shortcuts: {
    'border-base': 'border-gray/15',
    'bg-base': 'bg-white dark:bg-[#151515]',
    'n-bg-base': 'bg-base',
    'x-divider': 'h-1px w-full bg-gray/15',
  },
  theme: {
    colors: {
      primary: '#03ae67',
    },
  },
  presets: [
    presetUno(),
    presetAttributify(),
    presetIcons({
      prefix: '',
      scale: 1.2,
      extraProperties: {
        'display': 'inline-block',
        'vertical-align': 'middle',
      },
    }),
    presetWebFonts({
      fonts: {
        sans: 'Inter',
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
