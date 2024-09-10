import fs from 'node:fs'
import fsp from 'node:fs/promises'
import { logger } from '@nuxt/kit'
import { dirname, join } from 'pathe'
import type { Nuxt } from 'nuxt/schema'

const pagesIndexTemplate = `<script setup lang="ts">
const route = useRoute()
</script>

<template>
  <div>
    <h1>Nuxt Routing set up successfully!</h1>
    <p>Current route: {{ route.path }}</p>
    <a href="https://nuxt.com/docs/getting-started/routing" target="_blank">Learn more about Nuxt Routing</a>
  </div>
</template>
`

export async function enablePages(nuxt: Nuxt) {
  const pathApp = join(nuxt.options.srcDir, 'app.vue')
  const pathPageIndex = join(nuxt.options.srcDir, 'pages/index.vue')

  if (fs.existsSync(pathPageIndex)) {
    logger.warn('pages/index.vue already exists, skipping')
    return
  }

  let appContent = fs.existsSync(pathApp)
    ? await fsp.readFile(pathApp, 'utf-8')
    : undefined

  await fsp.mkdir(dirname(pathPageIndex), { recursive: true })
  await fsp.writeFile(pathPageIndex, pagesIndexTemplate, 'utf-8')

  if (appContent && !appContent.includes('<NuxtPage')) {
    appContent = appContent
      .replace('</template>', '  <NuxtPage />\n</template>')
      .replace(/<NuxtWelcome\s*\/>/, '')
    await fsp.writeFile(pathApp, appContent, 'utf-8')
  }

  logger.success('Routing creation wizard completed')
}
