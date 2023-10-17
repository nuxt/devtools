import { homedir } from 'node:os'
import { join } from 'node:path'
import { existsSync } from 'node:fs'
import fs from 'node:fs/promises'
import { randomStr } from '@antfu/utils'

let token: string | undefined

export async function getDevAuthToken() {
  if (token)
    return token

  const home = homedir()
  const dir = join(home, '.nuxt/devtools')
  const filepath = join(dir, 'dev-auth-token.txt')

  if (existsSync(filepath))
    token = (await fs.readFile(filepath, 'utf-8')).trim()

  if (!token)
    token = randomStr(16)

  await fs.mkdir(dir, { recursive: true })
  await fs.writeFile(filepath, token, 'utf-8')

  return token
}
