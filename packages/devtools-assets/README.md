# @nuxt/devtools-assets

Pre-built client UI assets for [Nuxt DevTools](https://github.com/nuxt/devtools).

`@nuxt/devtools` does not bundle its client UI. Instead, it declares this
version-locked package as [devframe remote assets](https://devfra.me/guide/client-assets.html#remote-assets):
files are resolved from a locally installed copy of this package when present,
otherwise streamed on demand from a CDN mirror of npm and cached on disk.

You normally don't need to install this package. For offline or air-gapped
environments, install it explicitly so the UI is served with zero network:

```sh
npm install -D @nuxt/devtools-assets
```

Keep its version in lockstep with `@nuxt/devtools` (it is published together
with each release).
