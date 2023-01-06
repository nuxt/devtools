import { defineNuxtModule } from '@nuxt/kit'

// TODO: demo only, should be contributed by modules
export default defineNuxtModule({
  meta: {
    name: 'custom-tabs',
  },
  setup(_, nuxt) {
    if (!nuxt.options.dev)
      return

    // TODO: vscode-server
    nuxt.hook('devtools:customTabs', (iframeTabs) => {
      iframeTabs.push({
        name: 'vscode',
        title: 'VS Code',
        icon: 'i-bxl-visual-studio',
        view: {
          type: 'iframe',
          src: `http://localhost:8000/?folder=${encodeURIComponent(nuxt.options.rootDir)}`,
        },
      })
    })
  },
})
