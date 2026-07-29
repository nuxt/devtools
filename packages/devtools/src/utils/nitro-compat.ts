import type { NitroConfig as NitroConfigV3, Nitro as NitroV3, StorageMounts as StorageMountsV3 } from 'nitro/types'
import type { NitroConfig as NitroConfigV2, Nitro as NitroV2, StorageMounts as StorageMountsV2 } from 'nitropack'

/**
 * Nuxt 5 can run on either Nitro v2 (`nitropack`) or the next-gen Nitro v3
 * (`nitro`) engine, so Nuxt's own hook types (`nitro:init`, `nitro:build:before`,
 * `nitro:config`, ...) type their `nitro`/`config` argument as a union of both.
 * Both are declared as *optional* peer dependencies of `@nuxt/devtools`, so a
 * consumer only ever has one of them installed (Nuxt 4 → `nitropack`,
 * Nuxt 5 → `nitro`).
 *
 * A missing optional peer resolves its `import type` to `any`. A naive
 * `NitroV2 | NitroV3` union would then collapse to `any` (since `X | any` is
 * `any`), silently dropping all type-safety on whichever engine *is* present.
 * Instead we detect which package actually resolved — `keyof any` matches every
 * key, so probing for an impossible `'___INVALID'` key distinguishes a real
 * Nitro type from the `any` fallback — and resolve to just that one. This is
 * the same detection `@nuxt/kit` performs internally, so our types line up with
 * the argument types of the Nuxt hooks we attach to.
 *
 * The two engines aren't just a version bump apart: Nitro v3 dropped the
 * `.storage` runtime property entirely (storage mounts are now a build-time
 * virtual module consumed via `useStorage()` from *inside* the built server,
 * not reachable from the orchestrating dev-tooling process that Nuxt DevTools
 * runs in). Code that inspects the live Nitro instance should use these union
 * types — and narrow defensively — rather than assuming the Nitro v2 shape.
 */
type HasNitroV2 = 'options' extends keyof NitroV2
  ? ('___INVALID' extends keyof NitroV2 ? false : true)
  : false
type HasNitroV3 = 'options' extends keyof NitroV3
  ? ('___INVALID' extends keyof NitroV3 ? false : true)
  : false

export type AnyNitro = HasNitroV2 extends true
  ? (HasNitroV3 extends true ? NitroV2 | NitroV3 : NitroV2)
  : NitroV3

export type AnyNitroConfig = HasNitroV2 extends true
  ? (HasNitroV3 extends true ? NitroConfigV2 | NitroConfigV3 : NitroConfigV2)
  : NitroConfigV3

export type AnyStorageMounts = HasNitroV2 extends true
  ? (HasNitroV3 extends true ? StorageMountsV2 | StorageMountsV3 : StorageMountsV2)
  : StorageMountsV3
