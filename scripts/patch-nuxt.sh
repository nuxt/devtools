set -xe

npx pnpm-patch-i nuxt ../nuxt/packages/nuxt
npx pnpm-patch-i nuxi ../nuxt/packages/nuxi
npx pnpm-patch-i @nuxt/schema ../nuxt/packages/schema

