import { defineNuxtModule } from '@nuxt/kit'
import Markdown from 'unplugin-vue-markdown/vite'
import LinkAttributes from 'markdown-it-link-attributes'
import type { BuiltinLanguage } from 'shiki'
import { createHighlighter } from 'shiki'
import { bundledLanguages } from 'shiki/langs'

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

    nuxt.hook('vite:extendConfig', async (config) => {
      config.plugins!.push(
        Markdown({
          async markdownItSetup(md) {
            md.use(LinkAttributes, {
              matcher: (link: string) => /^https?:\/\//.test(link),
              attrs: {
                target: '_blank',
                rel: 'noopener',
              },
            })

            const highlighter = await createHighlighter({
              themes: [
                'vitesse-dark',
                'vitesse-light',
              ],
              langs: Object.keys(bundledLanguages),
            })

            md.options.highlight = (code, lang) => {
              const _lang = (highlighter.getLoadedLanguages().includes(lang) ? lang : 'text') as BuiltinLanguage
              return highlighter.codeToHtml(code, {
                lang: _lang || 'text',
                themes: {
                  dark: 'vitesse-dark',
                  light: 'vitesse-light',
                },
              })
            }
          },
        }),
      )
    })
  },
})
