import { describe, expect, it } from 'vitest'
import { buildMessageEntry, MESSAGES_ADD_RPC } from '../src/notify-transport'

describe('client notify transport', () => {
  it('targets the Devframe 0.7 hub:messages:add RPC', () => {
    expect(MESSAGES_ADD_RPC).toBe('hub:messages:add')
  })

  it('defaults notify to true and level to info', () => {
    const entry = buildMessageEntry({ message: 'hello' })
    expect(entry.message).toBe('hello')
    expect(entry.notify).toBe(true)
    expect(entry.level).toBe('info')
  })

  it('preserves explicit level and notify', () => {
    const entry = buildMessageEntry({ message: 'bye', level: 'error', notify: false })
    expect(entry.level).toBe('error')
    expect(entry.notify).toBe(false)
  })

  it('forwards numeric lifetimes verbatim (never booleans)', () => {
    const entry = buildMessageEntry({ message: 'x', autoDismiss: 3000, autoDelete: 5000 })
    expect(entry.autoDismiss).toBe(3000)
    expect(entry.autoDelete).toBe(5000)
    expect(typeof entry.autoDismiss).toBe('number')
    expect(typeof entry.autoDelete).toBe('number')
  })
})
