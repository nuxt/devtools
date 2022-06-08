import fs from 'fs-extra'

const dereference = process.platform === 'win32' ? true : undefined

async function run() {
  await fs.ensureDir('public/shiki/')
  await fs.copy('node_modules/shiki/', 'public/shiki/', {
    dereference,
    filter: src => src === 'node_modules/shiki/' || src.includes('languages') || src.includes('dist'),
  })
  await fs.copy('node_modules/theme-vitesse/themes', 'public/shiki/themes', { dereference })
  await fs.copy('node_modules/theme-vitesse/themes', 'node_modules/shiki/themes', { overwrite: true, dereference })
}

run()
