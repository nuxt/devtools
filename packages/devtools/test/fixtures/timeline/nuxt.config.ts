import type { NuxtDevtoolsServerContext } from '../../../src/types'
import { defineNuxtConfig } from 'nuxt/config'
import { setup as setupTimeline } from '../../../src/integrations/timeline'

export default defineNuxtConfig({
  modules: [
    (_options, nuxt) => {
      setupTimeline({
        nuxt,
        options: {
          timeline: {
            enabled: true,
          },
        },
      } as NuxtDevtoolsServerContext)
    },
  ],
})
