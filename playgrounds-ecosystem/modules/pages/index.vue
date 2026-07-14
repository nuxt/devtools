<script setup lang="ts">
// @nuxt/content — query the collection defined in content.config.ts, giving
// the DevTools Content tab a real collection/DB to browse.
const { data: home } = await useAsyncData(() => queryCollection('content').path('/').first())

// nuxt-og-image — a zero-config default OG image is generated for every
// route from useSeoMeta's title/description; the DevTools OG Image tab lets
// you preview/edit the template for this route.
useSeoMeta({
  title: home.value?.title,
  description: home.value?.description,
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
  interface Window extends JSConfettiApi {}
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
</script>

<template>
  <div class="playground">
    <ContentRenderer v-if="home" :value="home" />

    <!-- @nuxt/fonts — a custom font-family used in CSS gets auto-detected
         and self-hosted; see assets/main.css. -->
    <p class="fonts-demo">
      This heading-ish line uses a custom self-hosted font (Space Grotesk).
    </p>

    <!-- @nuxt/image — NuxtImg optimizes/serves the sample asset via ipx. -->
    <NuxtImg
      src="/sample.png"
      width="480"
      height="252"
      format="webp"
      alt="Sample image served through @nuxt/image"
    />

    <button type="button" @click="celebrate">
      🎉 Celebrate (loads js-confetti via @nuxt/scripts)
    </button>
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
