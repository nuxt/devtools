import { defineConfig, presetAttributify, presetIcons, presetTypography, presetUno, presetWebFonts, transformerDirectives } from 'unocss'
import { unocssPreset as devtoolsUIKitUnoPreset } from '../../devtools-ui-kit/src/unocss'

export default defineConfig({
  shortcuts: [
    {
      // General Tokens
      'bg-base': 'n-bg-base',
      'bg-active': 'n-bg-active',
      'border-base': 'n-border-base',
      'glass-effect': 'backdrop-blur-6 bg-white/80 dark:bg-[#151515]/90',
      'navbar-glass': 'sticky z-10 top-0 glass-effect',

      'text-secondary': 'color-black/50 dark:color-white/50',

      // Reusable
      'x-divider': 'h-1px w-full bg-gray/15',
    },
    [/^theme-card-(\w+)$/, $ => `p2 flex gap2 border border-base bg-base items-center rounded min-w-40 min-h-25 justify-center transition-all saturate-0 op50 shadow hover:(op100 bg-${$[1]}/10 text-${$[1]}6 saturate-100)`],
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
    presetTypography(),
    devtoolsUIKitUnoPreset(),
  ],
  transformers: [
    transformerDirectives(),
  ],
  extraContent: {
    filesystem: [
      'content/*.md',
    ],
  },
  safelist: [
    'carbon-ibm-watson-discovery',
    'simple-icons-nuxtdotjs',
    'bxl-visual-studio',
  ],
})
