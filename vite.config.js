import { defineConfig } from 'vite'
import WindiCSS from 'vite-plugin-windicss'
import { HtmlTemplaterPlugin } from './plugins/html'
import { CrittersPlugin } from './plugins/critters'
import { resolve } from 'path'
import { readdirSync } from 'fs'

const r = (...path) => resolve(__dirname, ...path)

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        ...Object.fromEntries(readdirSync(r('templates')).map(dir => [dir, r('templates', dir, 'index.html')])),
        index: r('index.html')
      },
    }
  },
  plugins: [
    WindiCSS({
      scan: {
        dirs: ['templates'],
        fileExtensions: ['html'],
      },
    }),
    HtmlTemplaterPlugin(),
    CrittersPlugin()
  ]
})
