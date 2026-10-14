import { expect, it } from 'vitest'
import { fromThisMachine } from '../src/this-machine'

it.each([
  ['127.0.0.1', 'localhost:3000', true],
  ['::1', '[::1]:3000', true],
  ['::ffff:127.0.0.1', '127.0.0.1:3000', true],
  ['127.0.0.1', 'my-app.localhost', true],
  // Another device, even when it claims a local host
  ['192.168.1.20', 'localhost:3000', false],
  ['::ffff:192.168.1.20', '192.168.1.5:3000', false],
  // A tunnel or proxy on this machine that keeps its public host
  ['127.0.0.1', 'my-app.trycloudflare.com', false],
  ['127.0.0.1', '192.168.1.5:3000', false],
  ['127.0.0.1', 'localhost.example.com', false],
  ['127.0.0.1', undefined, false],
])('socket %s with Host %s is from this machine: %s', (remoteAddress, host, expected) => {
  expect(fromThisMachine({ socket: { remoteAddress }, headers: { host } })).toBe(expected)
})
