import type { NitroConfig as NitroConfigV3, Nitro as NitroV3 } from 'nitro/types'
import type { NitroConfig as NitroConfigV2, Nitro as NitroV2 } from 'nitropack'

/**
 * Nuxt 5 can run on either Nitro v2 (`nitropack`) or the next-gen Nitro v3
 * (`nitro`) engine, so Nuxt's own hook types (`nitro:init`, `nitro:build:before`,
 * `nitro:config`, ...) type their `nitro`/`config` argument as a union of both.
 *
 * The two engines aren't just a version bump apart: Nitro v3 dropped the
 * `.storage` runtime property entirely (storage mounts are now a build-time
 * virtual module consumed via `useStorage()` from *inside* the built server,
 * not reachable from the orchestrating dev-tooling process that Nuxt DevTools
 * runs in). Code that wants to inspect the live Nitro instance should use this
 * union type — and narrow defensively — rather than assuming the Nitro v2 shape.
 */
export type AnyNitro = NitroV2 | NitroV3

/** The `config` argument of the `nitro:config` hook — see {@link AnyNitro}. */
export type AnyNitroConfig = NitroConfigV2 | NitroConfigV3
