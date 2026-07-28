// @nuxt/eslint generates a project-aware flat config at
// `.nuxt/eslint.config.mjs` during `nuxi prepare`/`dev`. Re-exporting it here
// gives the DevTools "ESLint Config" tab a real config to introspect — that
// tab launches `@eslint/config-inspector` against whatever this file exports.
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt()
