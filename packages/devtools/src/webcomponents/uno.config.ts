import {
  defineConfig,
  presetIcons,
  presetWind3,
} from 'unocss'

export default defineConfig({
  shortcuts: [
    {
      'color-base': 'color-neutral-800 dark:color-neutral-200',
      'bg-base': 'bg-white dark:bg-#111',
      'bg-secondary': 'bg-#eee dark:bg-#222',
      'border-base': 'border-#8882',
      'ring-base': 'ring-#8882',
    },
    [/^bg-glass(:\d+)?$/, ([, opacity = ':75']) => `bg-white${opacity} dark:bg-#111${opacity} backdrop-blur-5`],
  ],
  presets: [
    presetWind3({
      dark: 'media',
    }),
    presetIcons({
      warn: true,
      collections: {
        logos: () => import('@iconify-json/logos').then(i => i.icons),
        ph: () => import('@iconify-json/ph').then(i => i.icons),
      },
    }),
  ],
})
