import { defineNuxtModule } from '@nuxt/kit'
import Markdown from 'vite-plugin-vue-markdown'
import LinkAttributes from 'markdown-it-link-attributes'
import { getHighlighter } from 'shiki'

export default defineNuxtModule({
  async setup(_, nuxt) {
    nuxt.options.imports.transform ||= {}
    nuxt.options.imports.transform.include = [/\.vue$/, /\.md$/]

    // @ts-expect-error any
    nuxt.options.components.transform ||= {}
    // @ts-expect-error any
    nuxt.options.components.transform.include = [/\.vue$/, /\.md$/]

    nuxt.options.vite.vue ||= {}
    nuxt.options.vite.vue.include = [/\.vue$/, /\.md$/]

    nuxt.options.extensions.push('.md')

    const highlighter = await getHighlighter({
      themes: [
        'vitesse-dark',
        'vitesse-light',
      ],
    })
    nuxt.hook('vite:extendConfig', async (config) => {
      config.plugins!.push(
        Markdown({
          markdownItSetup(md) {
            md.use(LinkAttributes, {
              matcher: (link: string) => /^https?:\/\//.test(link),
              attrs: {
                target: '_blank',
                rel: 'noopener',
              },
            })
            md.options.highlight = (code, lang) => {
              const dark = highlighter.codeToHtml(code, { lang, theme: 'vitesse-dark' })
                .replace('<pre class="shiki"', '<pre class="shiki shiki-dark"')
              const light = highlighter.codeToHtml(code, { lang: lang || 'text', theme: 'vitesse-light' })
                .replace('<pre class="shiki"', '<pre class="shiki shiki-light"')
              return `<div class="shiki-container">${dark}${light}</div>`
            }
          },
        }),
      )
    })
  },
})
