<script setup lang="ts">
// nuxt-og-image — a zero-config default OG image is generated for every
// route from useSeoMeta's title/description; the DevTools OG Image tab lets
// you preview/edit the template for this route.
useSeoMeta({
  title: 'Ecosystem playground',
  description: 'Dogfooding the Nuxt DevTools integrations of a few popular Nuxt modules.',
})

// @nuxt/scripts — load js-confetti via the useScriptNpm() registry script
// (bundled at build time, no third-party runtime request), giving the
// DevTools Scripts tab a real registered/loaded script to inspect.
interface JSConfettiApi {
  JSConfetti: {
    new (): { addConfetti: (options?: { emojis: string[] }) => void }
  }
}
declare global {
  interface Window {
    JSConfetti: JSConfettiApi['JSConfetti']
  }
}
const { onLoaded } = useScriptNpm<JSConfettiApi>({
  packageName: 'js-confetti',
  file: 'dist/js-confetti.browser.js',
  version: '0.12.0',
  scriptOptions: {
    bundle: true,
    use() {
      return { JSConfetti: window.JSConfetti }
    },
  },
})

function celebrate() {
  onLoaded(({ JSConfetti }) => {
    const confetti = new JSConfetti()
    confetti.addConfetti({ emojis: ['🌈', '⚡️', '💥', '✨', '💫', '🌸'] })
  })
}

// @nuxt/hints analyses this page for performance/security/hydration hints in
// its DevTools tab; no per-page code is needed — it inspects the app itself.
// @nuxt/eslint contributes the "ESLint Config" tab (launches the config
// inspector against eslint.config.mjs); no page code needed either.
</script>

<template>
  <div class="playground">
    <h1>Ecosystem playground</h1>
    <p>
      This page's default OG image is served by <strong>nuxt-og-image</strong>,
      so the DevTools OG Image tab has a real route to preview.
    </p>

    <!-- @nuxt/fonts — a custom font-family used in CSS gets auto-detected
         and self-hosted; see assets/main.css. -->
    <p class="fonts-demo">
      This heading-ish line uses a custom self-hosted font (Space Grotesk).
    </p>

    <button type="button" @click="celebrate">
      🎉 Celebrate (loads js-confetti via @nuxt/scripts)
    </button>

    <!-- @compodium/nuxt — a component from components/ that its playground can
         render in isolation; the DemoButton is auto-imported. -->
    <DemoButton label="A component Compodium can preview" />

    <!-- @nuxt/a11y — DELIBERATE accessibility violation so the a11y DevTools
         panel has a real finding to surface: an <img> with no alt text is a
         classic axe-core "image-alt" violation. Do not "fix" this — it exists
         precisely so the a11y tab isn't empty when dogfooding. A 1x1 inline
         data URI is used so Vite doesn't try to resolve it as an asset. -->
    <img
      src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="
      width="1"
      height="1"
    >
  </div>
</template>

<style scoped>
.playground {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 2rem;
}

.fonts-demo {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 1.5rem;
}
</style>
