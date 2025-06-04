import type { NuxtDevtoolsIframeClient } from '@nuxt/devtools-kit/types'
import type { Ref } from 'vue'
import { useDevtoolsClient } from '@nuxt/devtools-kit/iframe-client'

export const devToolsClient: Ref<NuxtDevtoolsIframeClient | undefined> = useDevtoolsClient()
