<script setup lang="ts">
const client = useClient()

const isInPopup = window.__NUXT_DEVTOOLS_IS_POPUP__

const showInfo = ref(false)
</script>

<template>
  <template v-if="!isInPopup">
    <NButton v-if="client?.popup" n="sm primary" @click="client.popup()">
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
          You currently browser seems not supporting the API or the flag is not enabled yet.
        </p>
        <div>
          <NButton @click="showInfo = false">
            Close
          </NButton>
        </div>
      </NDialog>
    </template>
  </template>
</template>
