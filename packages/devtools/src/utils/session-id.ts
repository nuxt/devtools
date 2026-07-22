let counter = 0

/**
 * Derive a unique terminal-session id from a readable base id.
 *
 * Devframe 0.7's terminals host throws (`DF8200`) when a session id is already
 * registered, and completed sessions intentionally linger for the dev-server's
 * lifetime. Repeated Nuxt-owned runs (analyze-build, install/uninstall, package
 * updates) therefore need a fresh id each time, while staying recognisable in
 * the Terminals dock.
 *
 * The suffix is a process-monotonic counter, so ids are collision-safe within a
 * dev-server process and still sort in start order.
 */
export function createUniqueSessionId(baseId: string): string {
  counter += 1
  return `${baseId}#${counter}`
}
