import consola from 'consola'
import { execa } from 'execa'
import { read, update, write } from 'rc9'

async function run() {
  const args = process.argv.slice(2)
  const command = args[0]

  if (command === 'enable') {
    consola.info('Installed Nuxt Devtools...')
    await execa('npm', ['install', '-g', '@nuxt/devtools@latest'])
    update({
      'modules[]': '@nuxt/devtools',
    }, '.nuxtrc')
    consola.info('Nuxt Devtools enabled! Restart your Nuxt app to start using it.')
  }
  else if (command === 'disable') {
    const rc = read('.nuxtrc')
    if (rc.modules?.includes('@nuxt/devtools')) {
      rc.modules = rc.modules.filter((m: string) => m !== '@nuxt/devtools')
      write(rc, '.nuxtrc')
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
