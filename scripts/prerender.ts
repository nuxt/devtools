import { basename, resolve, join } from 'path'
import { promises as fsp } from 'fs'
import glob from 'globby'
import mockData from '../data/messages.json'

const r = (...path: string[]) => resolve(join(__dirname, '..', ...path))

async function main () {
  const templates = await glob(r('dist/templates/*.js'))
  for (const file of templates) {
    console.log('Processing', basename(file).replace('.js', ''))
    const { template } = await import(file)
    const updated = template({
      ...mockData,
      name: '{{ name }}' // TODO
    })
    await fsp.writeFile(file.replace('.js', '/index.html'), updated)
  }
}

main().catch(console.error)
