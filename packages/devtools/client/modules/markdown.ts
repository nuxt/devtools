import type { BuiltinLanguage } from 'shiki'
import { addVitePlugin, defineNuxtModule, logger } from '@nuxt/kit'
import { consola } from 'consola'
import LinkAttributes from 'markdown-it-link-attributes'
import { createHighlighter } from 'shiki'
import { bundledLanguages } from 'shiki/langs'
import Markdown from 'unplugin-vue-markdown/vite'

export default defineNuxtModule({
  async setup(_, nuxt) {
    logger.restoreAll()
    consola.restoreAll()

    nuxt.options.imports.transform ||= {}
    nuxt.options.imports.transform.include = [/\.vue$/, /\.md$/]

    // @ts-expect-error any
    nuxt.options.components.transform ||= {}
    // @ts-expect-error any
    nuxt.options.components.transform.include = [/\.vue$/, /\.md$/]

    nuxt.options.vite.vue ||= {}
    nuxt.options.vite.vue.include = [/\.vue$/, /\.md$/]

    nuxt.options.extensions.push('.md')

    addVitePlugin(() => {
      return Markdown({
        frontmatter: false,
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
      })
    }, { server: false, client: true })
  },
})
