# Plan 005: Harden the assets RPC — path containment + fix the collision-rename bug

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving on. If a
> STOP condition occurs, stop and report — do not improvise. When done, update
> the status row for this plan in `plans/README.md` — unless a reviewer
> dispatched you and told you they maintain the index.
>
> **Drift check (run first)**: `git diff --stat c75c3b9..HEAD -- packages/devtools/src/server-rpc/assets.ts`
> If that file changed since this plan was written, compare the "Current state"
> excerpts against the live code; on a mismatch, STOP.

## Status

- **Priority**: P1
- **Effort**: S–M
- **Risk**: LOW
- **Depends on**: plans/001-unit-test-baseline.md
- **Category**: security / bug
- **Planned at**: commit `c75c3b9`, 2026-07-14

## Why this matters

The assets RPC functions run on the dev server and are called from the browser
DevTools client. Three defensive-maintenance problems, framed as code changes:

1. **Containment bypass in `writeStaticAssets`** — the "sandbox" base dir is built
   by string-concatenating a client-supplied `folder`
   (`resolve(srcDir, dir.public + folder)`), and the guard is a separator-less
   `finalPath.startsWith(baseDir)` (a sibling like `.../publicX` satisfies it). The
   default extension allowlist also permits `.js/.ts/.vue/.json`, so a write can land
   executable source that Vite may load. The function *intends* to confine writes to
   `/public`; the confinement is incomplete.
2. **No containment at all on read/delete/rename** — `getTextAssetContent`,
   `getImageMeta`, `deleteStaticAsset`, and `renameStaticAsset` take arbitrary paths
   with no boundary check (asymmetric with the write path). `getTextAssetContent`'s
   `limit` is client-controlled, so the 300-byte preview cap isn't a real bound.
3. **Collision-rename produces a corrupt filename** — when a same-named asset
   exists and `override` is false, the "add `-N` suffix" branch does
   `base = finalPath.slice(0, len - ext.length - 1)` where `ext` (from
   `path.parse`) already includes the leading dot, then builds `${base}-${i}.${ext}`.
   For `logo.png` this yields `log-1..png` (drops a char and doubles the dot).

## Current state

- `packages/devtools/src/server-rpc/assets.ts`. Relevant excerpts:
  ```ts
  // assets.ts:78-101 — read paths, no containment; client-controlled limit
  async getImageMeta(filepath: string) { ... imageMeta(await fsp.readFile(filepath)) ... }
  async getTextAssetContent(filepath: string, limit = 300) {
    const content = await fsp.readFile(filepath, 'utf-8')
    return content.slice(0, limit)
  }

  // assets.ts:102-136 — write path; bypassable containment + collision bug
  async writeStaticAssets(files: AssetEntry[], folder: string) {
    const baseDir = resolve(nuxt.options.srcDir, nuxt.options.dir.public + folder)
    return await Promise.all(files.map(async ({ path, content, encoding, override }) => {
      let finalPath = resolve(baseDir, path)
      if (!finalPath.startsWith(baseDir))
        throw new Error(`[Nuxt DevTools] File ${path} is not allowed to upload, it's outside of the public directory`)
      const { ext } = parse(finalPath)               // ext includes the dot, e.g. ".png"
      if (extensions !== '*') {
        if (!extensions.includes(ext.toLowerCase().slice(1)))
          throw new Error(...)
      }
      if (!override) {
        try {
          await fsp.stat(finalPath)
          const base = finalPath.slice(0, finalPath.length - ext.length - 1)   // BUG: -1 too many
          let i = 1
          while (await fsp.access(`${base}-${i}.${ext}`).then(() => true).catch(() => false))
            i++
          finalPath = `${base}-${i}.${ext}`                                     // BUG: `.${ext}` double dot
        }
        catch { /* Ignore error if file doesn't exist */ }
      }
      await fsp.writeFile(finalPath, content, { encoding: encoding ?? 'utf-8' })
      return finalPath
    }))
  }

  // assets.ts:137-145 — delete/rename, no containment
  async deleteStaticAsset(path: string) { return await fsp.unlink(path) }
  async renameStaticAsset(oldPath: string, newPath: string) { ... return await fsp.rename(oldPath, newPath) }
  ```
- Imports at the top: `import { parse, relative } from 'node:path'`,
  `import { join, resolve } from 'pathe'`, `import fsp from 'node:fs/promises'`.
- The scanned asset roots are already computed as `layerDirs`:
  ```ts
  // assets.ts:15-16
  const publicDir = resolve(nuxt.options.srcDir, nuxt.options.dir.public)
  const layerDirs = [publicDir, ...nuxt.options._layers.map(layer => resolve(layer.cwd, 'public'))]
  ```
- Default allowlist (`packages/devtools/src/constant.ts:66-95`, `defaultAllowedExtensions`)
  includes `json`, `js`, `jsx`, `ts`, `tsx`, `md`, `mdx`, `vue`.
- `pathe` exports `resolve`, `relative`, `sep` (POSIX-normalized). Prefer `pathe`
  for the boundary math for cross-platform consistency with the rest of the file.

## Commands you will need

| Purpose       | Command                                  | Expected           |
|---------------|------------------------------------------|--------------------|
| Install       | `pnpm install`                           | exit 0             |
| This test     | `pnpm test:unit -- asset-paths`          | new tests pass     |
| All unit tests| `pnpm test:unit`                         | exit 0             |
| Lint          | `pnpm lint` (autofix: `pnpm lint --fix`) | exit 0             |

## Scope

**In scope**:
- `packages/devtools/src/utils/asset-paths.ts` (create — pure, testable helpers)
- `packages/devtools/src/server-rpc/assets.ts` (use the helpers; fix the rename bug)
- `packages/devtools/test/asset-paths.test.ts` (create)

**Out of scope** (do NOT touch):
- `packages/devtools/src/constant.ts` `defaultAllowedExtensions` — do NOT change the
  allowlist in this plan (removing executable extensions is a behavior change better
  raised with the maintainer; note it in Maintenance). The containment fix is the
  primary mitigation.
- The `scan()` / `getStaticAssets()` listing logic and its cache.
- The `builder:watch` refresh wiring.

## Git workflow

- Branch: `fix/005-harden-assets-rpc` off the base branch.
- Conventional Commits. Suggested: `fix(devtools): contain asset RPC paths and fix collision filename`.
- Do NOT push or open a PR unless instructed.

## Steps

### Step 1: Create pure path helpers

Create `packages/devtools/src/utils/asset-paths.ts`:

```ts
import { relative, resolve } from 'pathe'

/** True if `target` resolves to `root` itself or something inside it. */
export function isInsideDir(root: string, target: string): boolean {
  const rel = relative(resolve(root), resolve(target))
  return rel === '' || (!rel.startsWith('..') && !rel.startsWith('/') && !/^[a-z]:/i.test(rel))
}

/** True if `target` is inside any of `roots`. */
export function isInsideAnyDir(roots: string[], target: string): boolean {
  return roots.some(root => isInsideDir(root, target))
}

/**
 * Resolve `path` inside `baseDir`, returning a collision-free variant when a file
 * already exists (uses `exists` to probe). Correctly preserves the extension:
 * `logo.png` -> `logo-1.png` (NOT `log-1..png`).
 */
export async function resolveCollisionFreePath(
  baseDir: string,
  path: string,
  override: boolean | undefined,
  exists: (p: string) => Promise<boolean>,
): Promise<string> {
  let finalPath = resolve(baseDir, path)
  if (override || !(await exists(finalPath)))
    return finalPath
  const dot = finalPath.lastIndexOf('.')
  const stem = dot > finalPath.lastIndexOf('/') ? finalPath.slice(0, dot) : finalPath
  const ext = dot > finalPath.lastIndexOf('/') ? finalPath.slice(dot) : '' // includes the dot
  let i = 1
  while (await exists(`${stem}-${i}${ext}`))
    i++
  finalPath = `${stem}-${i}${ext}`
  return finalPath
}
```

**Verify**: `test -f packages/devtools/src/utils/asset-paths.ts && echo OK` → `OK`.

### Step 2: Unit-test the helpers (including the exact bug regressions)

Create `packages/devtools/test/asset-paths.test.ts` (pattern from plan 001):

```ts
import { describe, expect, it } from 'vitest'
import { isInsideAnyDir, isInsideDir, resolveCollisionFreePath } from '../src/utils/asset-paths'

describe('isInsideDir', () => {
  it('accepts paths inside the root', () => {
    expect(isInsideDir('/app/public', '/app/public/img/logo.png')).toBe(true)
    expect(isInsideDir('/app/public', '/app/public')).toBe(true)
  })
  it('rejects traversal and sibling-prefix escapes', () => {
    expect(isInsideDir('/app/public', '/app/public/../secret')).toBe(false)
    expect(isInsideDir('/app/public', '/app/publicX/evil')).toBe(false) // separator-less prefix escape
    expect(isInsideDir('/app/public', '/etc/passwd')).toBe(false)
  })
})

describe('isInsideAnyDir', () => {
  it('accepts a path in any listed root', () => {
    expect(isInsideAnyDir(['/app/public', '/layer/public'], '/layer/public/a.png')).toBe(true)
    expect(isInsideAnyDir(['/app/public'], '/other/a.png')).toBe(false)
  })
})

describe('resolveCollisionFreePath', () => {
  const exists = (present: string[]) => async (p: string) => present.includes(p)
  it('returns the plain path when nothing exists', async () => {
    expect(await resolveCollisionFreePath('/p', 'logo.png', false, exists([]))).toBe('/p/logo.png')
  })
  it('suffixes correctly on collision (regression: not log-1..png)', async () => {
    const out = await resolveCollisionFreePath('/p', 'logo.png', false, exists(['/p/logo.png']))
    expect(out).toBe('/p/logo-1.png')
  })
  it('handles extensionless files', async () => {
    const out = await resolveCollisionFreePath('/p', 'LICENSE', false, exists(['/p/LICENSE']))
    expect(out).toBe('/p/LICENSE-1')
  })
  it('returns the plain path when override is true', async () => {
    expect(await resolveCollisionFreePath('/p', 'logo.png', true, exists(['/p/logo.png']))).toBe('/p/logo.png')
  })
})
```

**Verify**: `pnpm test:unit -- asset-paths` → all pass.

### Step 3: Apply the helpers in `assets.ts`

- Add `import { isInsideAnyDir, resolveCollisionFreePath } from '../utils/asset-paths'`.
- **Read functions** — at the top of `getImageMeta(filepath)` and
  `getTextAssetContent(filepath, limit = 300)`, reject out-of-tree paths:
  ```ts
  if (!isInsideAnyDir(layerDirs, filepath))
    throw new Error(`[Nuxt DevTools] File ${filepath} is outside the asset directories`)
  ```
  Also clamp the preview: `const max = Math.min(Math.max(0, limit), 10_000)` and
  `return content.slice(0, max)` so the client can't request an unbounded read.
- **`deleteStaticAsset(path)`** and both args of **`renameStaticAsset(oldPath, newPath)`**
  — guard with `isInsideAnyDir(layerDirs, ...)` before `fsp.unlink` / `fsp.rename`,
  throwing the same style of error when outside.
- **`writeStaticAssets`** — replace the manual base-dir concat + `startsWith` check +
  collision loop:
  ```ts
  const baseDir = resolve(publicDir, folder)         // resolve normalizes ".." in folder
  return await Promise.all(files.map(async ({ path, content, encoding, override }) => {
    const finalPath = await resolveCollisionFreePath(
      baseDir, path, override,
      p => fsp.access(p).then(() => true).catch(() => false),
    )
    if (!isInsideAnyDir(layerDirs, finalPath))
      throw new Error(`[Nuxt DevTools] File ${path} is not allowed to upload, it's outside of the public directory`)
    const { ext } = parse(finalPath)
    if (extensions !== '*' && !extensions.includes(ext.toLowerCase().slice(1)))
      throw new Error(`[Nuxt DevTools] File extension ${ext} is not allowed to upload, allowed extensions are: ${(extensions as string[]).join(', ')}\nYou can configure it in Nuxt config at \`devtools.assets.uploadExtensions\`.`)
    await fsp.writeFile(finalPath, content, { encoding: encoding ?? 'utf-8' })
    return finalPath
  }))
  ```
  Note: do the extension check on the resolved `finalPath`, and containment on the
  resolved path so `folder` can no longer relocate the base outside `public`.

**Verify**:
- `pnpm test:unit` → exit 0.
- `grep -n "finalPath.length - ext.length - 1" packages/devtools/src/server-rpc/assets.ts` → no matches.
- `grep -n "startsWith(baseDir)" packages/devtools/src/server-rpc/assets.ts` → no matches.
- `pnpm lint` → exit 0 (`pnpm lint --fix` if needed).

## Test plan

- New file `packages/devtools/test/asset-paths.test.ts` covering: inside/at-root
  acceptance, `..` traversal + separator-less sibling-prefix rejection, multi-root
  membership, and the collision-rename regression (`logo-1.png`, not `log-1..png`),
  extensionless files, and `override`.
- Structural pattern: `packages/devtools/test/serialize-js-literal.test.ts` (plan 001).
- Verification: `pnpm test:unit` → all pass.

## Done criteria

- [ ] `packages/devtools/src/utils/asset-paths.ts` exists and is used by `assets.ts`.
- [ ] `pnpm test:unit` exits 0; `asset-paths.test.ts` passes (incl. the `logo-1.png` regression).
- [ ] `grep -rn "finalPath.length - ext.length - 1" packages/devtools/src` → no matches.
- [ ] `grep -rn "startsWith(baseDir)" packages/devtools/src` → no matches.
- [ ] `getImageMeta`, `getTextAssetContent`, `deleteStaticAsset`, `renameStaticAsset`, `writeStaticAssets` all reject out-of-tree paths.
- [ ] `pnpm lint` exits 0.
- [ ] Only the three in-scope files are modified/created (`git status`).
- [ ] `plans/README.md` status row for 005 updated.

## STOP conditions

Stop and report (do not improvise) if:

- `assets.ts` doesn't match the "Current state" excerpts (drift).
- Legitimate DevTools asset operations demonstrably pass paths *outside* `layerDirs`
  (e.g. the UI is expected to preview files from `node_modules` or `.output`) — if
  so, the containment set may need widening; report the real call sites rather than
  loosening the guard to allow everything.
- A verification fails twice after a reasonable fix attempt.

## Maintenance notes

- Deferred (maintainer decision): trimming executable extensions
  (`js/ts/tsx/vue/json/md/mdx`) from `defaultAllowedExtensions` in `constant.ts`.
  Containment is the primary fix; the allowlist trim is a separate behavior change.
- The broader context (audit SEC-04): these RPCs sit behind transport-level auth
  delegated to Vite DevTools; confirm that layer authenticates / origin-checks
  callers. This plan hardens the functions' own input validation regardless.
- Reviewer: verify `layerDirs` is the correct containment set (public dir + each
  layer's public dir) and that `resolve(publicDir, folder)` plus the post-resolve
  containment check closes the `folder`-relocation hole.
