import { promises as fsp } from 'fs'
import { execSync } from 'child_process'
import { resolve } from 'pathe'
import { globby } from 'globby'

// Temporary forked from nuxt/framework

async function loadPackage (dir) {
  const pkgPath = resolve(dir, 'package.json')
  const data = JSON.parse(await fsp.readFile(pkgPath, 'utf-8').catch(() => '{}'))
  const save = () => fsp.writeFile(pkgPath, JSON.stringify(data, null, 2) + '\n')

  const updateDeps = (reviver) => {
    for (const type of ['dependencies', 'devDependencies', 'optionalDependencies', 'peerDependencies']) {
      if (!data[type]) { continue }
      for (const e of Object.entries(data[type])) {
        const dep = { name: e[0], range: e[1], type }
        delete data[type][dep.name]
        const updated = reviver(dep) || dep
        data[updated.type] = data[updated.type] || {}
        data[updated.type][updated.name] = updated.range
      }
    }
  }

  return {
    dir,
    data,
    save,
    updateDeps
  }
}

async function main () {
  const commit = execSync('git rev-parse --short HEAD').toString('utf-8').trim()
  const date = Math.round(Date.now() / (1000 * 60))
  const pkg = await loadPackage(process.cwd())
  pkg.data.version = `${pkg.data.version}-${date}.${commit}`
  pkg.data.name = pkg.data.name + '-edge'
  await pkg.save()
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err)
  process.exit(1)
})
