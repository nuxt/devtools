import { describe, expect, it } from 'vitest'
import { isAllowedRpcOrigin } from '../src/utils/rpc-origin'

describe('isAllowedRpcOrigin (cross-site WebSocket hijacking guard)', () => {
  it('allows same-origin browser connections', () => {
    expect(isAllowedRpcOrigin('http://localhost:3000', 'localhost:3000')).toBe(true)
    expect(isAllowedRpcOrigin('http://127.0.0.1:3000', '127.0.0.1:3000')).toBe(true)
    expect(isAllowedRpcOrigin('https://my-app.test', 'my-app.test')).toBe(true)
  })

  it('rejects cross-origin browser connections (the CSWSH vector)', () => {
    expect(isAllowedRpcOrigin('https://evil.com', 'localhost:3000')).toBe(false)
    // same host, different port is still a different origin
    expect(isAllowedRpcOrigin('http://localhost:5173', 'localhost:3000')).toBe(false)
  })

  it('allows connections without an Origin header (non-browser clients)', () => {
    expect(isAllowedRpcOrigin(undefined, 'localhost:3000')).toBe(true)
    expect(isAllowedRpcOrigin(null, 'localhost:3000')).toBe(true)
    expect(isAllowedRpcOrigin('', 'localhost:3000')).toBe(true)
  })

  it('rejects a malformed Origin header', () => {
    expect(isAllowedRpcOrigin('not a url', 'localhost:3000')).toBe(false)
  })

  it('rejects when the Host header is missing but an Origin is present', () => {
    expect(isAllowedRpcOrigin('http://localhost:3000', undefined)).toBe(false)
  })
})
