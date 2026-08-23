import { existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import antfu from '@antfu/eslint-config'
import { extend } from 'eslint-flat-config-utils'

// The client Nuxt app's generated flat config only exists once the app has been
// prepared (`pnpm dev:prepare`/`pnpm build`). Skip it gracefully when it hasn't
// been generated yet (e.g. a fresh `pnpm install && pnpm lint` in CI) so linting
// doesn't hard-crash on the missing import.
const clientConfigUrl = new URL('./packages/devtools/client/.nuxt/eslint.config.mjs', import.meta.url)
const hasClientConfig = existsSync(fileURLToPath(clientConfigUrl))

const config = antfu(
  {
    formatters: true,
    unocss: true,
    pnpm: true,
    ignores: [
      '**/.generated/**',
      '**/plans/**/*.md',
      // Its own sealed pnpm workspace (see
      // playgrounds-ecosystem/modules/pnpm-workspace.yaml), opt-in and out of
      // the main lint/typecheck/test surface.
      '**/playgrounds-ecosystem/**',
    ],
  },
  {
    rules: {
      'node/prefer-global/process': 'off',
      'vue/no-v-text-v-html-on-component': 'off',
    },
  },
)
  .removeRules(
    'vue/no-multiple-template-root',
  )

// `FlatConfigComposer.append()` mutates the composer in place (and returns it),
// so the export stays a `const`.
if (hasClientConfig) {
  config.append(
    extend(
      import(clientConfigUrl.href).then(mod => mod.default()),
      'packages/devtools/client',
    ),
  )
}
else {
  // Before the client app is prepared, its generated flat config (which wires up
  // `eslint-plugin-unimport`) is absent, so the `unimport/auto-insert` rule the
  // client's inline `eslint-disable` directives reference is undefined. Register
  // the plugin so those directives resolve and linting doesn't error.
  config.append(
    import('eslint-plugin-unimport').then(mod => ({
      name: 'nuxt-devtools/client/unimport-fallback',
      files: ['packages/devtools/client/**/*.{ts,vue}'],
      plugins: { unimport: mod.default ?? mod },
      rules: { 'unimport/auto-insert': 'off' },
      // The rule is off in this fallback, so the client's inline disable
      // directives read as "unused"; don't report (or auto-fix away) them —
      // they are needed once the client app is prepared and the rule is active.
      linterOptions: { reportUnusedDisableDirectives: 'off' },
    })),
  )
}

export default config
