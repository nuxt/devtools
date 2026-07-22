import { existsSync } from 'node:fs'
import fs from 'node:fs/promises'
import { homedir, platform } from 'node:os'
import { dirname } from 'node:path'
import { hash } from 'ohash'
import { join } from 'pathe'

interface LocalOptionSearchOptions {
  root: string
  key?: string | boolean
}

export function getOptionsDir() {
  const home = homedir()
  const osPlatform = platform()

  // From research, there three are not trying to be XDG compliant. Leave it as before
  if (osPlatform === 'win32' || osPlatform === 'darwin' || osPlatform === 'haiku') {
    return join(home, '.nuxt/devtools')
  }

  // https://specifications.freedesktop.org/basedir/latest/#variables
  // Check if env var is set, otherwise fallback to $HOME/.config
  const xdgBase = process.env.XDG_CONFIG_HOME ?? join(home, '.config')
  return join(xdgBase, 'nuxt/devtools')
}

export async function readLocalOptions<T>(defaults: T, options: LocalOptionSearchOptions): Promise<T> {
  const { filePath } = getOptionsFilepath(options)

  if (existsSync(filePath)) {
    try {
      const options = {
        ...defaults,
        ...JSON.parse(await fs.readFile(filePath, 'utf-8')).settings || {},
      }
      return options
    }
    catch (e) {
      console.error(`[DevTools] failed to parse local options file: ${filePath}, fallback to defaults`)
      console.error(e)
      return { ...defaults }
    }
  }
  else {
    return { ...defaults }
  }
}

function getOptionsFilepath(options: LocalOptionSearchOptions) {
  let hashedKey

  if (options.key)
    hashedKey = hash(`${options.root}:${options.key}`)
  else
    hashedKey = hash(options.root)

  const dir = getOptionsDir()
  const filePath = join(dir, '.nuxt/devtools', `${hashedKey}.json`)

  return {
    filePath,
    hashedKey,
  }
}

export async function clearLocalOptions(options: LocalOptionSearchOptions) {
  const { filePath } = getOptionsFilepath(options)
  if (existsSync(filePath))
    await fs.unlink(filePath)
}

export async function writeLocalOptions<T>(settings: T, options: LocalOptionSearchOptions) {
  const { filePath, hashedKey } = getOptionsFilepath(options)

  await fs.mkdir(dirname(filePath), { recursive: true })
  await fs.writeFile(
    filePath,
    JSON.stringify(
      {
        root: options.root,
        hash: hashedKey,
        settings,
      },
      null,
      2,
    ),
    'utf-8',
  )
}
