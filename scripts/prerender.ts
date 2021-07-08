import { resolve, join } from 'path'
import { promises as fsp } from 'fs'
import template from 'lodash.template'
import glob from 'globby'
import messages from '../data/messages.json'

const r = (...path) => resolve(join(__dirname, '..', ...path))

async function main() {
  const htmlFiles = await glob(r('dist/**/*.html'))
  for (const file of htmlFiles) {
      console.log('Process', file)
      const contents = await fsp.readFile(file, 'utf-8')
      const updated = template(contents, { interpolate: /{{([\s\S]+?)}}/g })({
        messages,
        name: '{{ name }}' // TODO
      })
      await fsp.writeFile(file, updated)
  }
}

main().catch(console.error)
