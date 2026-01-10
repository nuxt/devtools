export default defineAppConfig({
  socials: {
    nuxt: 'https://nuxt.com',
    x: 'https://x.com/nuxt_js',
  },
  ui: {
    colors: {
      primary: 'green',
      secondary: 'sky',
      neutral: 'slate',
      gray: 'slate',
    },
  },
  elements: {
    variables: {
      light: {
        background: '255 255 255',
        foreground: 'var(--color-gray-700)',
      },
      dark: {
        background: 'var(--color-gray-950)',
        foreground: 'var(--color-gray-200)',
      },
    },
  },
})
