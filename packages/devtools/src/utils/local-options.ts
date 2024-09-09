import { existsSync } from 'node:fs'
import fs from 'node:fs/promises'
import { homedir } from 'node:os'
import { dirname } from 'node:path'
import { hash } from 'ohash'
import { join } from 'pathe'

interface LocalOptionSearchOptions {
  root: string
  key?: string | boolean
}

export function getHomeDir() {
  return process.env.XDG_CONFIG_HOME || homedir()
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

  const home = getHomeDir()
  const filePath = join(home, '.nuxt/devtools', `${hashedKey}.json`)

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
