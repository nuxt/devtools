import { theme as unoTheme } from '@unocss/preset-mini'
import { fonts } from '@unocss/preset-mini/rules'
import { parseColor } from '@unocss/preset-mini/utils'
import {
  mergeDeep,
  presetAttributify,
  presetIcons,
  presetTypography,
  presetUno,
  presetWebFonts,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss'
import type { Preset, RuleContext } from '@unocss/core'
import type { UnocssNuxtOptions } from '@unocss/nuxt'
import type { Theme } from '@unocss/preset-uno'

// @unocss-include

export function unocssPreset(): Preset {
  return {
    name: '@nuxt/devtools-ui-kit',
    theme: mergeDeep<Theme>(unoTheme, {
      colors: {
        brand: '#00DC82',
        primary: '#099e61',
        context: 'rgba(var(--nui-c-context),%alpha)',
      },
    }),
    rules: [
      [/^n-(.*)$/, ([, body]: string[], { theme }: RuleContext<Theme>) => {
        const color = parseColor(body, theme)
        if (color?.cssColor?.type === 'rgb' && color.cssColor.components) {
          return {
            '--nui-c-context': `${color.cssColor.components.join(',')}`,
          }
        }
      }],
      [/^n-(.*)$/, fonts[1][1] as any],
      ['n-dashed', { 'border-style': 'dashed' }],
      ['n-solid', {
        'background-color': 'rgba(var(--nui-c-context), 1) !important',
        'border-color': 'rgba(var(--nui-c-context), 1)',
        'color': 'white !important',
      }],
      ['n-disabled', {
        'opacity': 0.6,
        'pointer-events': 'none',
        'filter': 'saturate(0)',
      }],
      /**
       * Credit to Nanda Syahrasyad (https://github.com/narendrasss)
       *
       * - https://github.com/narendrasss/NotANumber
       * - https://www.nan.fyi/grid.svg
       * - https://www.nan.fyi/grid-dark.svg
       */
      ['n-panel-grids-light', {
        'background-image': 'url("data:image/svg+xml,%0A%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'20\' height=\'20\' transform=\'scale(3)\'%3E%3Crect x=\'0\' y=\'0\' width=\'100%25\' height=\'100%25\' fill=\'white\'/%3E%3Cpath d=\'M 10,-2.55e-7 V 20 Z M -1.1677362e-8,10 H 20 Z\' stroke-width=\'0.2\' stroke=\'hsla(0, 0%25, 98%25, 1)\' fill=\'none\'/%3E%3C/svg%3E")',
        'background-size': '40px 40px',
      }],
      ['n-panel-grids-dark', {
        'background-image': 'url("data:image/svg+xml,%0A%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'20\' height=\'20\' transform=\'scale(3)\'%3E%3Crect x=\'0\' y=\'0\' width=\'100%25\' height=\'100%25\' fill=\'hsl(0, 0%25, 8.5%25)\'/%3E%3Cpath d=\'M 10,-2.55e-7 V 20 Z M -1.1677362e-8,10 H 20 Z\' stroke-width=\'0.2\' stroke=\'hsl(0, 0%25, 11.0%25)\' fill=\'none\'/%3E%3C/svg%3E");',
        'background-size': '40px 40px',
      }],
    ],
    variants: [
      (input: string) => {
        const prefix = 'n-disabled:'
        if (input.startsWith(prefix)) {
          return {
            matcher: input.slice(prefix.length),
            selector: input => `[disabled] ${input}, ${input}[disabled]`,
          }
        }
      },
      (input: string) => {
        const prefix = 'n-checked:'
        if (input.startsWith(prefix)) {
          return {
            matcher: input.slice(prefix.length),
            selector: input => `[checked] ${input}, ${input}[checked]`,
          }
        }
      },
    ],
    shortcuts: {
      // general
      'n-bg-base': 'bg-white dark:bg-[#151515]',
      'n-bg-active': 'bg-gray:5',
      'n-bg-hover': 'bg-gray:3',
      'n-border-base': 'border-gray/20',

      'n-transition': 'transition-all duration-200',
      'n-focus-base': 'ring-2 ring-context/50',
      'n-active-base': 'ring-3 ring-context/10',
      'n-borderless': '!border-transparent !shadow-none',

      // link
      'n-link-base': 'underline underline-offset-2 underline-black/20 dark:underline-white/40',
      'n-link-hover': 'decoration-dotted text-context underline-context! op100!',

      // card
      'n-card-base': 'border n-border-base rounded n-bg-base shadow-sm',

      // header
      'n-header-upper': 'text-sm uppercase mb-2 leading-1.2em tracking-wide op50',

      // button
      'n-button-base': 'border n-border-base rounded shadow-sm px-1em py-0.25em inline-flex items-center gap-1 op80 !outline-none touch-manipulation',
      'n-button-hover': 'op100 !border-context text-context',
      'n-button-active': 'n-active-base bg-context/5',
      'n-button-icon': '-ml-0.2em mr-0.2em text-1.1em',

      // checkbox
      'n-checkbox': 'inline-flex gap-1 items-center rounded',
      'n-checkbox-hover': 'op100 n-bg-hover cursor-pointer',
      'n-checkbox-box': 'border n-border-base w-1.1em h-1.1em mr-1 text-white flex flex-none items-center rounded-sm overflow-visible',
      'n-checkbox-box-checked': 'bg-context border-context',
      'n-checkbox-icon': 'carbon-checkmark w-1em h-1em m-auto',

      // radio
      'n-radio-box': 'border rounded n-border-base w-1.2em h-1.2em mr-1 text-white flex flex-none rounded-full overflow-visible',
      'n-radio-hover': 'op100 n-bg-hover cursor-pointer',
      'n-radio-box-checked': 'border-context',
      'n-radio-inner': 'bg-context rounded-1/2 w-0 h-0 m-auto',
      'n-radio-inner-checked': 'w-0.8em h-0.8em',

      // switch
      'n-switch-base': 'inline-flex items-center select-none rounded-full pe-2',
      'n-switch-hover': 'op100 n-bg-hover cursor-pointer',
      'n-switch-slider': 'mr-1 rounded-full border n-border-base relative p-2px',
      'n-switch-slider-checked': 'border-context/20 bg-context/10',
      'n-switch-thumb': 'h-1em w-1em rounded-1/2 border n-border-base ml-0 mr-0.8em',
      'n-switch-thumb-checked': 'bg-context border-context ml-0.8em mr-0',

      // tip
      'n-tip-base': 'bg-context/4 text-context px-1em py-0.4em rounded flex gap-2 items-center dark:bg-context/12',

      // icon
      'n-icon': 'flex-none',

      // code
      'n-code-block': 'dark:bg-[#121212] bg-white',

      // icon-button
      'n-icon-button': 'aspect-1/1 w-1.6em h-1.6em flex items-center justify-center rounded op50 hover:op100 hover:n-bg-active',

      // badge
      'n-badge-base': 'bg-context/10 text-context rounded whitespace-nowrap select-none',
      'n-badge': 'n-badge-base mx-0.5 px-1.5 py-0.5 text-xs',

      // loading
      'n-loading': 'flex h-full w-full justify-center items-center',
      'n-panel-grids': 'n-panel-grids-light dark:n-panel-grids-dark',
      'n-panel-grids-center': 'n-panel-grids flex flex-col h-full gap-2 items-center justify-center',

      // glass
      'n-glass-effect': 'backdrop-blur-6 bg-white/80 dark:bg-[#151515]/90',
      'n-navbar-glass': 'sticky z-10 top-0 n-glass-effect',
    },
  }
}

export function extendUnocssOptions(user: UnocssNuxtOptions = {}): UnocssNuxtOptions {
  return {
    ...user,
    preflight: true,
    presets: [
      presetUno(),
      presetAttributify(),
      presetTypography(),
      presetIcons({
        prefix: ['i-', ''],
        scale: 1.2,
        extraProperties: {
          'display': 'inline-block',
          'vertical-align': 'middle',
        },
        // ...(user?.icons || {})
      }),
      presetWebFonts({
        fonts: {
          sans: 'DM Sans',
          mono: 'DM Mono',
        },
      }),
      unocssPreset(),
      ...(user.presets || []),
    ],
    transformers: [
      transformerDirectives(),
      transformerVariantGroup(),
    ],
  }
}
