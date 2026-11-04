import { readdirSync, readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { HUB_UI_LOCALES } from '@devframes/hub-ui'
import { describe, expect, it } from 'vitest'
import { DEVTOOLS_LOCALES } from '../client/i18n/locales'

const localesDir = fileURLToPath(new URL('../client/locales/', import.meta.url))

function flatKeys(value: unknown, prefix = ''): string[] {
  if (value && typeof value === 'object')
    return Object.entries(value).flatMap(([key, child]) => flatKeys(child, `${prefix}${key}.`))
  return [
    prefix.slice(0, -1),
  ]
}

function readLocale(code: string) {
  return JSON.parse(readFileSync(`${localesDir}${code}.json`, 'utf8'))
}

describe('devtools client locales', () => {
  it('matches the languages of the Devframe hub UI', () => {
    expect(Object.keys(DEVTOOLS_LOCALES).sort()).toEqual(Object.keys(HUB_UI_LOCALES).sort())
  })

  it('has one message file per locale', () => {
    const files = readdirSync(localesDir).map(file => file.replace(/\.json$/, '')).sort()
    expect(files).toEqual(Object.keys(DEVTOOLS_LOCALES).sort())
  })

  it('translates every English key', () => {
    const source = flatKeys(readLocale('en')).sort()
    for (const code of Object.keys(DEVTOOLS_LOCALES))
      expect(flatKeys(readLocale(code)).sort(), code).toEqual(source)
  })
})
