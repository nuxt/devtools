import { homedir } from 'node:os'
import { existsSync } from 'node:fs'
import fs from 'node:fs/promises'
import { join } from 'pathe'
import { hash } from 'ohash'

interface Options {
  root: string
  key: string | boolean
}

export async function readOptions<T>(defaults: T, options: Options): Promise<T> {
  let hashedKey
  if (options.key)
    hashedKey = hash(`${options.root}:${options.key}`)
  else
    hashedKey = hash(options.root)
  const filePath = join(homedir(), '.nuxt/devtools', `${hashedKey}.json`)

  if (existsSync(filePath)) {
    const options = {
      ...defaults,
      ...JSON.parse(await fs.readFile(filePath, 'utf-8')).settings || {},
    }
    return options
  }
  else {
    return { ...defaults }
  }
}

export async function writeOptions<T>(settings: T, options: Options) {
  const dir = join(homedir(), '.nuxt/devtools')
  if (!existsSync(dir))
    await fs.mkdir(dir, { recursive: true })

  let hashedKey
  if (options.key)
    hashedKey = hash(`${options.root}:${options.key}`)
  else
    hashedKey = hash(options.root)
  const filePath = join(dir, `${hashedKey}.json`)

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
