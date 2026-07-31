import type { Nitro as NitroV3, StorageMounts as StorageMountsV3 } from 'nitro/types'
import type { Nitro as NitroV2, StorageMounts as StorageMountsV2 } from 'nitropack'

/**
 * `nitropack` (Nitro v2) and `nitro` (Nitro v3) are both declared as *optional*
 * peer dependencies, so a consumer only ever has one installed (Nuxt 4 →
 * `nitropack`, Nuxt 5 → `nitro`). A missing peer resolves its `import type` to
 * `any`, which would collapse a naive `V2 | V3` union to `any`. Detect which
 * package actually resolved — `keyof any` matches every key, so probing an
 * impossible `'___INVALID'` key tells a real Nitro type from the `any`
 * fallback — and resolve to just that one. Mirrors `@nuxt/kit`'s own detection.
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

export type AnyStorageMounts = HasNitroV2 extends true
  ? (HasNitroV3 extends true ? StorageMountsV2 | StorageMountsV3 : StorageMountsV2)
  : StorageMountsV3
