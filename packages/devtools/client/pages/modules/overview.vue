<script setup lang="ts">
import { useRouter } from '#app/composables/router'
import { definePageMeta } from '#imports'
import { computed } from 'vue'
import { useClient } from '~/composables/client'
import { useAutoImports, useServerConfig } from '~/composables/state'
import { useComponents } from '~/composables/state-components'
import { useInstalledModules } from '~/composables/state-modules'
import { useAllRoutes } from '~/composables/state-tabs'
import { isFirstVisit } from '~/composables/storage'
import { getIsMacOS } from '~/composables/utils'
import { version } from '../../../package.json'
import { showConnectionWarning } from '../../composables/client'
import { ensureDevAuthToken } from '../../composables/dev-auth'
import { formatDuration, pluralizeByCount } from '../../composables/utils'

definePageMeta({
  icon: 'carbon-information',
  title: 'Overview',
  order: -100,
})

const client = useClient()
const config = useServerConfig()
const components = useComponents()
const autoImports = useAutoImports()
const installedModules = useInstalledModules()
const routes = useAllRoutes()
const isMacOS = getIsMacOS()

const router = useRouter()
function goIntro() {
  isFirstVisit.value = true
  router.push('/')
}

const vueVersion = computed(() => client.value?.nuxt.vueApp.version)
const metricsLoading = computed(() => client.value?.metrics.loading())

function authorize() {
  ensureDevAuthToken()
}
</script>

<template>
  <NPanelGrids h-screen w-full flex>
    <div v-if="!config">
      Loading...
    </div>
    <div v-else flex="~ col gap2" ma h-full max-w-300 w-full p5 px5 md:px20>
      <div flex-auto />

      <!-- Banner -->
      <div flex="~ col" mt-5 items-center md:mt-20>
        <NuxtLink
          flex="~" mt--10 items-center justify-center
          to="https://devtools.nuxt.com/" target="_blank"
        >
          <NuxtLogo h-10 />
        </NuxtLink>
        <button mb6 mt3 text-center text-sm flex="~ gap-1 wrap" @click="goIntro">
          <span op40>
            Nuxt DevTools
          </span>
          <code op40>v{{ version }}</code>
          <NpmVersionCheck package-name="@nuxt/devtools" :options="{ dev: true }" :show-version="false" />
        </button>
      </div>
      <!-- Main Grid -->
      <div flex="~ gap2 wrap">
        <NuxtLink to="https://nuxt.com" target="_blank" theme-card-green p4 flex="~ col auto">
          <div logos-nuxt-icon text-3xl />
          <NpmVersionCheck package-name="nuxt" :options="{ dev: true }" />
        </NuxtLink>
        <NuxtLink v-if="vueVersion" to="https://vuejs.org" target="_blank" theme-card-green p4 flex="~ col auto">
          <div logos-vue text-3xl />
          <code>v{{ vueVersion }}</code>
        </NuxtLink>
        <template v-if="config">
          <NuxtLink
            v-if="config && config.pages && client" min-w-40 theme-card-lime p4 flex="~ col auto"
            to="/modules/pages"
          >
            <div carbon-tree-view-alt text-3xl />
            <div>{{ pluralizeByCount(routes.length, 'page') }}</div>
          </NuxtLink>
          <NuxtLink v-if="config" min-w-40 theme-card-lime p4 flex="~ col auto" to="/modules/components">
            <div i-carbon-assembly-cluster text-3xl />
            <div>{{ pluralizeByCount(components.length, 'component') }}</div>
          </NuxtLink>
          <NuxtLink v-if="config && autoImports" min-w-40 theme-card-yellow p4 flex="~ col auto" to="/modules/imports">
            <div carbon-function text-3xl />
            <div>{{ pluralizeByCount(autoImports.imports.length, 'import') }}</div>
          </NuxtLink>
          <NuxtLink v-if="config" min-w-40 theme-card-purple p4 flex="~ col auto" to="/modules/modules">
            <div carbon-3d-mpr-toggle text-3xl />
            <div>{{ pluralizeByCount(installedModules.length, 'module') }}</div>
          </NuxtLink>
          <NuxtLink v-if="config" min-w-40 theme-card-teal p4 flex="~ col auto" to="/modules/plugins">
            <div carbon-plug text-3xl />
            <div>{{ pluralizeByCount(config.plugins.length, 'plugin') }}</div>
          </NuxtLink>
          <div v-if="metricsLoading" pointer-events-none min-w-40 theme-card-lime p4 flex="~ auto gap-6">
            <div i-carbon-time-plot flex-none text-3xl />
            <div grid="~ cols-[auto_auto] gap-x-5 items-center">
              <template v-if="metricsLoading.ssrStart">
                <div text-sm>
                  SSR to full load
                </div>
                <div text-right>
                  {{ formatDuration(metricsLoading.appLoad! - metricsLoading.ssrStart!) }}
                </div>
              </template>
              <div text-sm>
                Page load
              </div>
              <div text-right>
                {{ formatDuration(metricsLoading.appLoad! - metricsLoading.appInit!) }}
              </div>
              <div text-sm>
                Navigation
              </div>
              <div text-right>
                {{ formatDuration(metricsLoading.pageEnd! - metricsLoading.pageStart!) }}
              </div>
              <template v-if="metricsLoading.hmrStart">
                <div text-sm>
                  HMR
                </div>
                <div text-right>
                  {{ formatDuration(metricsLoading.hmrEnd! - metricsLoading.hmrStart!) }}
                </div>
              </template>
            </div>
          </div>
        </template>
      </div>
      <div flex="~ col gap2">
        <NTip v-if="showConnectionWarning" n="yellow5" icon="carbon-unlink" justify-center>
          Not connected to the client app, showing server-side data only. Use the embedded mode for full features.
        </NTip>
        <button title="Authorize" @click="authorize">
          <NTip v-if="!isDevAuthed" n="orange5" icon="i-carbon-locked" justify-center>
            Access from an untrusted browser, some features are limited. Click to authorize now.
          </NTip>
        </button>
      </div>
      <div flex="~ gap-6 wrap" mt-5 items-center justify-center>
        <a
          href="https://github.com/nuxt/devtools" target="_blank" flex="~ gap1" items-center op50 hover="op100 text-blue"
          transition
        >
          <div i-carbon-star />
          Star on GitHub
        </a>
        <a
          href="https://github.com/nuxt/devtools/discussions/29" target="_blank" flex="~ gap1" items-center op50
          hover="op100 text-yellow" transition
        >
          <div i-carbon-data-enrichment />
          Ideas & Suggestions
        </a>
        <a
          href="https://github.com/nuxt/devtools/discussions/31" target="_blank" flex="~ gap1" items-center op50
          hover="op100 text-lime" transition
        >
          <div i-carbon-plan />
          Project Roadmap
        </a>
        <a
          href="https://github.com/nuxt/devtools/issues" target="_blank" flex="~ gap1" items-center op50
          hover="op100 text-rose" transition
        >
          <div i-carbon-debug />
          Bug Reports
        </a>
        <NuxtLink to="/settings" flex="~ gap1" inline-block items-center op50 hover:op80>
          <div i-carbon-settings-adjust />
          Settings
        </NuxtLink>
      </div>
      <div flex-auto />
      <div flex="col gap-2" mxa hidden w-100 text-sm op50 md:flex>
        <div flex="~ gap-1" items-center>
          <template v-if="isMacOS">
            <NButton n="xs" class="px2">
              ⌘ Cmd
            </NButton>
            <span>+</span>
            <NButton n="xs" class="px2">
              K
            </NButton>
          </template>
          <template v-else>
            <NButton n="xs" class="px2">
              Ctrl
            </NButton>
            <span>+</span>
            <NButton n="xs" class="px2">
              K
            </NButton>
          </template>
          <div flex-auto />
          Open Command Palette
        </div>
        <div flex="~ gap-1" items-center>
          <template v-if="isMacOS">
            <NButton n="xs" class="px2">
              ⇧ Shift
            </NButton>
            <span>+</span>
            <NButton n="xs" class="px2">
              ⌥ Option
            </NButton>
            <span>+</span>
            <NButton n="xs" class="px2">
              D
            </NButton>
          </template>
          <template v-else>
            <NButton n="xs" class="px2">
              Shift
            </NButton>
            <span>+</span>
            <NButton n="xs" class="px2">
              Alt
            </NButton>
            <span>+</span>
            <NButton n="xs" class="px2">
              D
            </NButton>
          </template>
          <div flex-auto />
          <div>Toggle DevTools</div>
        </div>
      </div>
    </div>
  </NPanelGrids>
</template>
