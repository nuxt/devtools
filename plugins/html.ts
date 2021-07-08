import { resolve, join } from 'path'
import { promises as fsp } from 'fs'
import type { Plugin } from 'vite'
import template from 'lodash.template'
import messages from '../data/messages.json'

const r = (...path) => resolve(join(__dirname, '..', ...path))

export const HtmlTemplaterPlugin = () => {
    return <Plugin> {
        name: 'html-template',
        async transformIndexHtml(html: string, context) {
            const page = context.originalUrl || '/'
            if (page === '/') {
                const templateNames = await fsp.readdir(r('templates'))
                const serializedData = JSON.stringify({ templateNames })
                return html.replace('{{ data }}', serializedData)
            }
            const contents = await fsp.readFile(r(page, 'index.html'), 'utf-8')
            return template(contents, { interpolate: /{{([\s\S]+?)}}/g })({ messages })
        }
    }
}
