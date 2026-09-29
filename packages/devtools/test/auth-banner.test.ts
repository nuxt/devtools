import type { NuxtTerminal, NuxtTerminalNotification } from '@nuxt/kit'
import { describe, expect, it } from 'vitest'
import { createTerminalAuthBanner } from '../src/auth-banner'

function createFakeTerminal() {
  const notices: (NuxtTerminalNotification & { dismissed: boolean })[] = []
  const terminal: NuxtTerminal = {
    interactive: true,
    withTerminal: work => work(),
    prompt: async () => undefined,
    startTask: () => ({ update: () => {}, stop: () => {} }),
    notify(notification) {
      const notice = { ...notification, dismissed: false }
      notices.push(notice)
      return {
        dismiss: () => {
          notice.dismissed = true
        },
        dismissed: Promise.resolve(),
      }
    },
  }
  return { notices, terminal }
}

describe('createTerminalAuthBanner', () => {
  it('surfaces the code and auth URL as a terminal notice', () => {
    const { notices, terminal } = createFakeTerminal()
    const { banner } = createTerminalAuthBanner(() => terminal)

    banner({ code: '881725', url: 'http://localhost:3000/#devframe_otp=881725' })

    expect(notices).toHaveLength(1)
    expect(notices[0]!.message).toContain('881725')
    expect(notices[0]!.message).toContain('http://localhost:3000/#devframe_otp=881725')
    expect(notices[0]!.dismissed).toBe(false)
  })

  it('retracts the previous notice when the code rotates', () => {
    const { notices, terminal } = createFakeTerminal()
    const { banner } = createTerminalAuthBanner(() => terminal)

    banner({ code: '111111', url: 'http://localhost:3000/#devframe_otp=111111' })
    banner({ code: '222222', url: 'http://localhost:3000/#devframe_otp=222222' })

    expect(notices.map(notice => notice.dismissed)).toEqual([true, false])
  })

  it('retracts the notice once the code exchange succeeds', () => {
    const { notices, terminal } = createFakeTerminal()
    const { banner, onTrusted } = createTerminalAuthBanner(() => terminal)

    banner({ code: '881725', url: 'http://localhost:3000/#devframe_otp=881725' })
    onTrusted()

    expect(notices.map(notice => notice.dismissed)).toEqual([true])
  })
})
