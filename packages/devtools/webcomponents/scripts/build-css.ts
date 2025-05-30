import { Buffer } from 'node:buffer'
import fs from 'node:fs/promises'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import c from 'ansis'
import chokidar from 'chokidar'
import { transform } from 'lightningcss'
import { glob } from 'tinyglobby'
import { createGenerator } from 'unocss'
import config from '../uno.config'

const SRC_DIR = fileURLToPath(new URL('..', import.meta.url))
const GLOBS = ['components/**/*.vue']
const USER_STYLE = join(SRC_DIR, 'style.css')
const GENERATED_CSS = join(SRC_DIR, '.generated/css.ts')
const MINIFY = true

export async function buildCSS() {
  const files = await glob(GLOBS, {
    cwd: SRC_DIR,
    absolute: true,
  })

  const generater = await createGenerator(config)

  // Extra tokens for UnoCSS
  const tokens = new Set<string>()
  for (const file of files) {
    const content = await fs.readFile(file, 'utf-8')
    await generater.applyExtractors(content, file, tokens)
  }

  // Read user style
  const userStyle = await fs.readFile(USER_STYLE, 'utf-8').catch(() => '')

  const unoResult = await generater.generate(tokens)
  const input = [
    userStyle,
    unoResult.css,
  ].join('\n')

  // Minify the CSS with LightningCSS
  try {
    const { code: css } = transform({
      code: Buffer.from(input, 'utf-8'),
      filename: 'style.css',
      targets: {
        chrome: 100,
      },
      minify: MINIFY,
    })
    await fs.writeFile(GENERATED_CSS, `export default ${JSON.stringify(String(css))}`)
    console.log(`${c.green('✓')} CSS built`)

    return {
      css,
      files,
    }
  }
  catch (e: any) {
    console.error(`${c.red('!')} Failed to build css`, e)
    if (e.loc) {
      console.error('Error at line', e.loc.line, 'column', e.loc.column)
      console.error(input.split('\n')[e.loc.line - 1])
      console.error(`${' '.repeat(e.loc.column - 1)}^`)
    }
  }
}

export async function watchCSS() {
  const watcher = chokidar.watch(join(SRC_DIR, 'components'))
  watcher.on('change', async () => {
    await buildCSS()
  })

  return watcher
}
