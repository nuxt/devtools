<script setup lang="ts">
const client = useClient()

const isInPopup = window.__NUXT_DEVTOOLS_IS_POPUP__
const isSecureContext = computed(() => window.isSecureContext)

const showInfo = ref(false)
const copy = useCopy()

function popup() {
  const fn = client.value?.devtools?.popup
  if (fn) {
    telemetry('popup')
    fn()
  }
}
</script>

<template>
  <template v-if="!isInPopup">
    <NButton v-if="client?.devtools.popup && isSecureContext" n="sm primary" @click="popup()">
      <div carbon-launch /> Popup
    </NButton>
    <template v-else>
      <NButton n="sm primary" @click="showInfo = true">
        <div carbon-launch /> Popup <span mt-0.5 text-xs op50>(not supported)</span>
      </NButton>
      <NDialog
        v-model="showInfo" class="max-w-150 p6 pt-2 prose"
        @close="showInfo = false"
      >
        <h1 text-3xl>
          Popup is not Supported
        </h1>
        <p>
          To popup the DevTools, it requires the <a href="https://developer.chrome.com/docs/web-platform/document-picture-in-picture/" target="_blank">Document Picture-in-Picture API</a> which is currently in experimental state.
        </p>
        <p>
          As June 2023, the API is only available in Chrome 111 and above, under a flag <code>#document-picture-in-picture-api</code>.
        </p>
        <p>
          Your current browser does not seem to support the API, or the flag is not enabled yet.
          You can try enabling the flag by visiting
          <NButton n="xs primary" title="Click to Copy" @click="copy('chrome://flags/#document-picture-in-picture-api', 'external-docs')">
            chrome://flags/#document-picture-in-picture-api
          </NButton>
          and restart the browser.
        </p>
        <NTip v-if="!isSecureContext" class="mb-4" n="orange">
          Please note that the popup feature only works when your server is running under HTTPS.
          <NuxtLink to="https://nuxt.com/docs/api/nuxt-config#https" target="_blank">
            Learn how to run your server with https on Nuxt's Documentation
          </NuxtLink>
        </NTip>
        <div>
          <NButton @click="showInfo = false">
            Close
          </NButton>
        </div>
      </NDialog>
    </template>
  </template>
</template>
