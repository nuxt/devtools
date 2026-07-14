/**
 * Namespace prefix for Nuxt DevTools' own server RPC functions, following the
 * devframe convention of prefixing identifiers with the plugin name
 * (`<plugin>:<name>`), matching the `nuxt:devtools` dock id.
 *
 * Core functions are registered under `nuxt:devtools:<name>` and the client
 * calls them by that name.
 */
export const RPC_NAMESPACE = 'nuxt:devtools'
