import initUnocssRuntime from '@unocss/runtime'
import presetIcons from '@unocss/preset-icons'

initUnocssRuntime({
  defaults: {
    presets: [
      presetIcons({
        collections: {
          logos: () => import('@iconify-json/logos/icons.json').then(r => r.default),
          carbon: () => import('@iconify-json/carbon/icons.json').then(r => r.default),
          ri: () => import('@iconify-json/ri/icons.json').then(r => r.default)
        },
        cdn: 'https://esm.sh/'
      })
    ]
  }
})
