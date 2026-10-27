import { PassThrough } from 'node:stream'
import { afterEach, expect, it, vi } from 'vitest'
import { confirmInTerminal } from '../src/terminal-confirm'

const COMMAND = [
  'npm',
  'i',
  '-D',
  '@nuxt/devtools@^4.0.0',
]

function terminal({ isTTY = true, isRaw = false } = {}) {
  const asked: string[] = []
  const warned: string[] = []
  return {
    input: Object.assign(new PassThrough(), { isTTY, isRaw }),
    asked,
    warned,
    ask: (message: string) => asked.push(message),
    warn: (message: string) => warned.push(message),
  }
}

afterEach(() => {
  vi.useRealTimers()
})

it.each([
  // nuxi's TUI holds stdin in raw mode, so a single key answers
  [true, 'y', true],
  [true, 'Y', true],
  [true, 'w', false],
  [true, '\r', false],
  // nuxi's plain mode reads lines
  [false, 'yes\n', true],
  [false, 'y\n', true],
  [false, '\n', false],
  [false, 'no\n', false],
])('raw mode %s: answers %j with %s', async (isRaw, key, allowed) => {
  const t = terminal({ isRaw })
  const answer = confirmInTerminal(COMMAND, t)
  expect(t.asked[0]).toMatch(isRaw ? /^Press y / : /^Type yes and press Enter /)
  expect(t.asked[0]).toContain('npm i -D @nuxt/devtools@^4.0.0')

  t.input.write(key)
  expect(await answer).toBe(allowed)
  expect(t.input.readableFlowing).toBe(false)
})

it('keeps the terminal flowing for the TUI that read it first', async () => {
  const t = terminal({ isRaw: true })
  const keys: string[] = []
  t.input.on('data', chunk => keys.push(String(chunk)))

  const answer = confirmInTerminal(COMMAND, t)
  t.input.write('y')
  expect(await answer).toBe(true)
  expect(t.input.readableFlowing).toBe(true)
  expect(keys).toEqual(['y'])
})

it('refuses at once without a terminal', async () => {
  const t = terminal({ isTTY: false })
  expect(await confirmInTerminal(COMMAND, t)).toBe(false)
  expect(t.asked).toEqual([])
  expect(t.warned[0]).toContain('npm i -D @nuxt/devtools@^4.0.0')
})

it('refuses when nobody answers within 5 minutes', async () => {
  vi.useFakeTimers()
  const t = terminal({ isRaw: true })
  const answer = confirmInTerminal(COMMAND, t)

  vi.advanceTimersByTime(5 * 60_000)
  expect(await answer).toBe(false)
  expect(t.warned).toHaveLength(1)
  t.input.write('y')
  expect(t.input.readableFlowing).toBe(false)
})
