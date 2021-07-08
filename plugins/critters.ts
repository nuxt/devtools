import { resolve, join } from 'path'
import { promises as fsp } from 'fs'
import type { Plugin } from 'vite'
import Critters from 'critters'
import glob from 'globby'

const r = (...path) => resolve(join(__dirname, '..', ...path))

export const CrittersPlugin = () => {
    return <Plugin> {
        name: 'critters',
        enforce: 'post',
        async writeBundle() {
            const distDir = r('dist')
            const critters = new Critters({ path: distDir })
            const htmlFiles = await glob(r('dist/**/*.html'))
            for (const file of htmlFiles) {
                console.log('Process', file)
                const html = await fsp.readFile(file, 'utf-8')
                let result = await critters.process(html)
                // result = result.replace(/<script[^>]*>[\s\S]*?<\/script>/g, '')
                result = result.replace(/<link[^>]*>/g, '')
                await fsp.writeFile(file, result)
            }
        }
    }
}
