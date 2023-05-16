import { existsSync } from 'node:fs'
import fsp from 'node:fs/promises'
import { relative } from 'node:path'
import { consola } from 'consola'
import c from 'picocolors'
import { parseModule } from 'magicast'
import { diffLines } from 'diff'
import { join } from 'pathe'
import prompts from 'prompts'

function findNuxtConfig(cwd: string) {
  const names = [
    'nuxt.config.ts',
    'nuxt.config.js',
  ]

  for (const name of names) {
    const path = join(cwd, name)
    if (existsSync(path))
      return path
  }
}

function printOutManual(value: boolean) {
  consola.info(c.yellow('To manually enable Nuxt Devtools, add the following to your Nuxt config:'))
  consola.info(c.cyan(`\n  devtools: { enabled: ${value} }\n`))
}

async function toggleConfig(cwd: string, value?: boolean) {
  const nuxtConfig = findNuxtConfig(cwd)
  if (!nuxtConfig) {
    consola.error(c.red('Unable to find Nuxt config file in current directory'))
    process.exitCode = 1
    printOutManual(true)
    return false
  }

  try {
    const source = await fsp.readFile(nuxtConfig, 'utf-8')
    const mod = await parseModule(source, { sourceFileName: nuxtConfig })
    const config = mod.exports.default.$type === 'function-call'
      ? mod.exports.default.$args[0]
      : mod.exports.default

    if (config.devtools || value) {
      config.devtools ||= {}
      if (typeof config.devtools === 'object')
        config.devtools.enabled = value
    }

    const generated = mod.generate().code

    if (source.trim() === generated.trim()) {
      consola.info(c.yellow(`Nuxt Devtools is already ${value ? 'enabled' : 'disabled'}`))
    }
    else {
      consola.log('')
      consola.log('We are going to update the Nuxt config with with the following changes:')
      consola.log(c.bold(c.green(`./${relative(cwd, nuxtConfig)}`)))
      consola.log('')
      printDiffToCLI(source, generated)
      consola.log('')

      const { confirm } = await prompts({
        type: 'confirm',
        name: 'confirm',
        message: 'Continue?',
        initial: true,
      })

      if (!confirm)
        return false

      await fsp.writeFile(nuxtConfig, `${generated.trimEnd()}\n`, 'utf-8')
    }
  }
  catch (err) {
    consola.error(c.red('Unable to update Nuxt config file automatically'))
    process.exitCode = 1
    printOutManual(true)
    return false
  }

  return true
}

export async function enable(cwd: string) {
  if (await toggleConfig(cwd, true)) {
    // disable global devtools
    await import('./global').then(r => r.disableSilently(cwd))
    consola.success(c.green('Nuxt Devtools is enabled! Restart your Nuxt app to start using it.'))
  }
}

export async function disable(cwd: string) {
  if (await toggleConfig(cwd, false)) {
    // disable global devtools
    await import('./global').then(r => r.disableSilently(cwd))
    consola.success('Nuxt Devtools disabled for this project.')
  }
}

// diff `from` and `to` by line and pretty print to console with line numbers, using the `diff` package
function printDiffToCLI(from: string, to: string) {
  const diffs = diffLines(from.trim(), to.trim())
  let output = ''

  let no = 0

  // TODO: frame only the diff parts
  for (const diff of diffs) {
    const lines = diff.value.trimEnd().split('\n')
    for (const line of lines) {
      if (!diff.added)
        no += 1
      if (diff.added)
        output += c.green(`+    | ${line}\n`)
      else if (diff.removed)
        output += c.red(`-${no.toString().padStart(3, ' ')} | ${line}\n`)
      else
        output += c.gray(`${c.dim(`${no.toString().padStart(4, ' ')} |`)} ${line}\n`)
    }
  }

  consola.log(output.trimEnd())
}
