const LOOPBACK_ADDRESS_RE = /^(?:127(?:\.\d{1,3}){3}|::1|::ffff:127(?:\.\d{1,3}){3})$/
const LOCAL_HOST_RE = /^(?:(?:[a-z\d-]+\.)*localhost|127(?:\.\d{1,3}){3}|\[::1\])(?::\d+)?$/i

/**
 * Whether the request comes from a browser on the machine that runs the dev
 * server. The socket must be loopback, which another device cannot fake, and
 * the `Host` a local name, so a tunnel or proxy on this machine that keeps
 * its public host does not count either.
 */
export function fromThisMachine(req: { socket: { remoteAddress?: string }, headers: { host?: string } }): boolean {
  return LOOPBACK_ADDRESS_RE.test(req.socket.remoteAddress ?? '') && LOCAL_HOST_RE.test(req.headers.host ?? '')
}
