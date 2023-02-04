import consola from 'consola'
import { execa } from 'execa'
import { read, update, write } from 'rc9'
import { name } from '../package.json'

const RC_PATH = '.nuxtrc'

async function run() {
  const args = process.argv.slice(2)
  const command = args[0]

  if (command === 'enable') {
    consola.info('Installed Nuxt Devtools...')
    await execa('npm', ['install', '-g', `${name}@latest`])
    update({ 'modules[]': name }, RC_PATH)
    consola.info('Nuxt Devtools enabled! Restart your Nuxt app to start using it.')
  }
  else if (command === 'disable') {
    const rc = read(RC_PATH)
    if (rc.modules?.includes(name)) {
      rc.modules = rc.modules.filter((m: string) => m !== name)
      write(rc, RC_PATH)
      consola.success('Nuxt Devtools disabled.')
    }
    else {
      consola.warn('Nuxt Devtools is not enabled.')
    }
  }
  else {
    consola.log(`Unknown command "${command}"`)
  }
}

run()
  .catch((err) => {
    consola.error(err)
    process.exit(1)
  })
