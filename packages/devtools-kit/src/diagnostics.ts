import type { DiagnosticDefinition } from 'nostics'
import type { Nuxt } from 'nuxt/schema'
import type { NuxtDevtoolsServerContext } from './_types/server-ctx'
import { useNuxt } from '@nuxt/kit'
import { createConsoleReporter, defineDiagnostics } from 'nostics'

export { createConsoleReporter, defineDiagnostics }

/**
 * Canonical docs URL for a Nuxt DevTools diagnostic code.
 *
 * Each code links to a per-code anchor in the v4 migration guide, e.g.
 * `NDT_DEP_0001` → `.../module/migration-v4#ndt_dep_0001`.
 */
export function diagnosticsDocsBase(code: string | number): string {
  return `https://devtools.nuxt.com/module/migration-v4#${String(code).toLowerCase()}`
}

/**
 * Parameters shared by every deprecation code: the API being used and its
 * recommended replacement. Interpolated into the `why`/`fix` messages.
 */
export interface DeprecationParams {
  /** The deprecated API / option being used. */
  api: string
  /** The recommended replacement to migrate to. */
  replacement: string
}

/**
 * The Nuxt DevTools diagnostics catalog.
 *
 * Codes are grouped by prefix:
 * - `NDT_DEP_xxxx` — soft/hard deprecations (this is the only range used today).
 *
 * Severity is **not** encoded here; it is chosen per emission via the reporter
 * `method` (`warn` by default, `error` for hard breaks).
 */
export const diagnosticCodes = {
  /** `startSubprocess().getProcess()` → `getResult()`. */
  NDT_DEP_0001: {
    why: (p: DeprecationParams) => `\`${p.api}\` is deprecated.`,
    fix: (p: DeprecationParams) => `Use \`${p.replacement}\` instead.`,
  },
  // NDT_DEP_0002 is retired (was `disableAuthorization`, now a supported
  // first-class option). The code is left unused so numbers stay stable.
  /** `extendServerRpc` → `onDevtoolsReady((ctx) => ctx.rpc.register(...))`. */
  NDT_DEP_0003: {
    why: (p: DeprecationParams) => `\`${p.api}\` is deprecated.`,
    fix: (p: DeprecationParams) => `Use \`${p.replacement}\` instead.`,
  },
  /** `startSubprocess` → `onDevtoolsReady((ctx) => ctx.terminals.startChildProcess(...))`. */
  NDT_DEP_0004: {
    why: (p: DeprecationParams) => `\`${p.api}\` is deprecated.`,
    fix: (p: DeprecationParams) => `Use \`${p.replacement}\` instead.`,
  },
  /** `addCustomTab` → `onDevtoolsReady((ctx) => ctx.docks.register(...))`. */
  NDT_DEP_0005: {
    why: (p: DeprecationParams) => `\`${p.api}\` is deprecated.`,
    fix: (p: DeprecationParams) => `Use \`${p.replacement}\` instead.`,
  },
  /** `refreshCustomTabs` → `onDevtoolsReady((ctx) => ctx.docks.register(...))`. */
  NDT_DEP_0006: {
    why: (p: DeprecationParams) => `\`${p.api}\` is deprecated.`,
    fix: (p: DeprecationParams) => `Use \`${p.replacement}\` instead.`,
  },
  /** Direct `nuxt.devtools.rpc` access (`broadcast` / `functions`). */
  NDT_DEP_0007: {
    why: (p: DeprecationParams) => `\`${p.api}\` is deprecated.`,
    fix: (p: DeprecationParams) => `Use \`${p.replacement}\` instead.`,
  },
  /** Removed `vscode` module option → `codeServer`. */
  NDT_DEP_0008: {
    why: (p: DeprecationParams) => `\`${p.api}\` is deprecated and its legacy modes are no longer supported.`,
    fix: (p: DeprecationParams) => `Use \`${p.replacement}\` instead. The legacy value is ignored rather than partially translated.`,
  },
  /** `getServerData()` RPC → the Data Inspector panel's `Nuxt Application` source. */
  NDT_DEP_0009: {
    why: (p: DeprecationParams) => `\`${p.api}\` is deprecated.`,
    fix: (p: DeprecationParams) => `Use \`${p.replacement}\` instead.`,
  },
} satisfies Record<string, DiagnosticDefinition<DeprecationParams>>

export type NuxtDiagnosticCode = keyof typeof diagnosticCodes

/**
 * Standalone catalog that prints to the terminal via nostics'
 * {@link createConsoleReporter} (default method `warn`). Works before the Vite
 * DevTools kit connects, so it is the fallback sink for pre-connect emissions.
 */
export const consoleDiagnostics = defineDiagnostics({
  docsBase: diagnosticsDocsBase,
  reporters: [createConsoleReporter()],
  codes: diagnosticCodes,
})

/**
 * Per-context diagnostics state. Kept in a WeakMap keyed by the server context
 * rather than at module scope so it never bleeds across multiple Nuxt instances
 * sharing one process (see `packages/devtools/src/constant.ts`).
 */
interface DiagnosticsState {
  /** The host catalog, once the Vite DevTools kit has connected. */
  hostCatalog?: Record<string, (...args: any[]) => any>
  /** Dedupe set of `${code}:${key}` handles already emitted. */
  emitted: Set<string>
}

const stateByCtx = new WeakMap<object, DiagnosticsState>()
/** Fallback state used when no server context is resolvable yet. */
const fallbackState: DiagnosticsState = { emitted: new Set() }

function getState(ctx: object | undefined): DiagnosticsState {
  if (!ctx)
    return fallbackState
  let state = stateByCtx.get(ctx)
  if (!state) {
    state = { emitted: new Set() }
    stateByCtx.set(ctx, state)
  }
  return state
}

function getServerContext(nuxt: Nuxt): NuxtDevtoolsServerContext | undefined {
  // @ts-expect-error `devtools` is assigned onto the Nuxt instance internally.
  return nuxt?.devtools
}

/**
 * Register the Nuxt deprecation codes into the connected Vite DevTools kit's
 * diagnostics host so they are known to DevTools and post-connect emissions
 * surface in the DevTools diagnostics UI. Safe to call when no host is present.
 *
 * Called from `connectDevToolsKit`.
 */
export function registerHostDiagnostics(ctx: NuxtDevtoolsServerContext): void {
  const host = ctx.devtoolsKit?.diagnostics
  if (!host)
    return
  const catalog = host.defineDiagnostics({
    docsBase: diagnosticsDocsBase,
    codes: diagnosticCodes,
  })
  host.register(catalog)
  getState(ctx).hostCatalog = catalog as Record<string, (...args: any[]) => any>
}

/**
 * Options for {@link deprecate}.
 */
export interface DeprecateOptions {
  /**
   * Dedupe key appended to the code. Defaults to the code itself, i.e. the
   * deprecation warns once per process. Pass a finer key (e.g. a subprocess id)
   * to warn once per distinct call site instead.
   */
  key?: string
  /**
   * Reporter method / severity. `warn` (default) for soft deprecations, `error`
   * for hard breaks. The returned {@link Diagnostic} can be thrown to abort.
   */
  method?: 'warn' | 'error'
}

/**
 * Emit a Nuxt DevTools deprecation diagnostic.
 *
 * Routing: when the Vite DevTools kit is connected the emission goes through the
 * DevTools host catalog (terminal **and** the DevTools diagnostics UI); before
 * connect it falls back to the terminal-only console catalog. A single emission
 * per call — no double printing.
 *
 * Deduped per `${code}:${key ?? code}` on the resolved server context, so a hot
 * path warns only once.
 *
 * @returns the built `Diagnostic` (which extends `Error`, so it can be thrown
 * for hard breaks), or `undefined` if the emission was deduped.
 */
export function deprecate(
  nuxt: Nuxt,
  code: NuxtDiagnosticCode,
  params: DeprecationParams,
  options: DeprecateOptions = {},
): Error | undefined {
  const ctx = getServerContext(nuxt)
  const state = getState(ctx)

  const dedupeKey = `${code}:${options.key ?? code}`
  if (state.emitted.has(dedupeKey))
    return
  state.emitted.add(dedupeKey)

  const method = options.method ?? 'warn'
  const hostHandle = state.hostCatalog?.[code]
  if (hostHandle)
    return hostHandle(params, { method }) as Error

  const handle = consoleDiagnostics[code] as (p: DeprecationParams, o?: { method?: 'warn' | 'error' }) => Error
  return handle(params, { method })
}

/**
 * Build a standalone nostics catalog that prints to the terminal.
 *
 * Used by the connect-safe `nuxt.devtools.diagnostics` accessor so module
 * authors can define + emit diagnostics before the Vite DevTools kit connects.
 * A `createConsoleReporter()` is added automatically unless the caller supplies
 * its own `reporters`.
 */
export function defineStandaloneDiagnostics(
  options: Parameters<typeof defineDiagnostics>[0],
): ReturnType<typeof defineDiagnostics> {
  return defineDiagnostics({
    ...options,
    reporters: options.reporters ?? [createConsoleReporter()],
  })
}

/**
 * Convenience wrapper for call sites that don't already hold the Nuxt instance.
 */
export function deprecateWithNuxt(
  code: NuxtDiagnosticCode,
  params: DeprecationParams,
  options?: DeprecateOptions,
): Error | undefined {
  return deprecate(useNuxt(), code, params, options)
}
