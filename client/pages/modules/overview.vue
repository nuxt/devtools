<script setup lang="ts">
import { version } from '../../../package.json'

definePageMeta({
  icon: 'carbon-information',
  title: 'Overview',
  order: -100,
})

const client = useClient()
const config = useServerConfig()
const versions = usePackageVersions()
const components = useComponents()
const autoImports = useAutoImports()
const routes = useAllRoutes()

const nuxtVersion = computed(() => versions.value?.find(v => v.name === 'nuxt'))

const router = useRouter()
function goIntro() {
  isFirstVisit.value = true
  router.push('/')
}
</script>

<template>
  <div h-full w-full flex>
    <div v-if="!config">
      Loading...
    </div>
    <div v-else flex="~ col gap2" w-full ma max-w-300 p10>
      <!-- Banner -->
      <div flex="~ col" items-center>
        <div flex="~" justify-center items-center mt--10>
          <NuxtLogo h-16 />
          <button mr--16 mt--6 @click="goIntro">
            <Badge
              bg-green-400:10 text-green-400
              title="preview"
              v-text="'preview'"
            />
          </button>
        </div>
        <div text-center text-sm mt--1 op30 mb6>
          Nuxt DevTools
          <code>v{{ version }}</code>
        </div>
      </div>
      <!-- Main Grid -->
      <div flex="~ gap2 wrap">
        <div v-if="nuxtVersion" p4 theme-card-green flex="~ col auto">
          <div logos-nuxt-icon text-3xl />
          <code>{{ `v${nuxtVersion.current}` }}</code>
          <template v-if="nuxtVersion.latest">
            <Badge
              v-if="nuxtVersion.needsUpdate"
              bg-green-400:10 text-green-400 mt--1
              title="updates available"
              v-text="'updates available'"
            />
            <Badge
              v-else
              bg-gray-400:10 text-gray-400 mt--1
              title="latest"
              v-text="'latest'"
            />
          </template>
        </div>
        <template v-if="config">
          <NuxtLink v-if="config && config.pages && client" p4 theme-card-lime min-w-40 flex="~ col auto" to="/modules/pages">
            <div text-3xl carbon-tree-view-alt />
            <div>{{ routes.length }} pages</div>
          </NuxtLink>
          <NuxtLink v-if="config" p4 theme-card-lime min-w-40 flex="~ col auto" to="/modules/components">
            <div text-3xl carbon-nominal />
            <div>{{ components.length }} components</div>
          </NuxtLink>
          <NuxtLink v-if="config && autoImports" p4 min-w-40 theme-card-yellow flex="~ col auto" to="/modules/imports">
            <div text-3xl carbon-function />
            <div>{{ autoImports.imports.length }} imports</div>
          </NuxtLink>
          <NuxtLink v-if="config" p4 min-w-40 theme-card-purple flex="~ col auto" to="/modules/modules">
            <div text-3xl carbon-3d-mpr-toggle />
            <div>{{ config._installedModules.length }} modules</div>
          </NuxtLink>
          <NuxtLink v-if="config" p4 min-w-40 theme-card-teal flex="~ col auto" to="/modules/plugins">
            <div text-3xl carbon-plug />
            <div>{{ config.plugins.length }} plugins</div>
          </NuxtLink>
        </template>
      </div>
      <!-- <div bg-red:10 flex-full /> -->
      <div flex="~ col gap2">
        <div
          v-if="showConnectionWarning"
          px4 theme-banner-yellow justify-center
        >
          <span flex-none i-carbon-unlink />Not connected to the client, showing server-side data only. Use the embedded mode for full features.
        </div>
      </div>

      <div flex="~ col" items-center mt-5>
        <div flex="~ gap-6" p4>
          <a href="https://github.com/nuxt/devtools/discussions/29" target="_blank" flex="~ gap1" items-center op50 hover="op100 text-yellow" transition>
            <div i-carbon-data-enrichment />
            Ideas & Suggestions
          </a>
          <a href="https://github.com/nuxt/devtools/discussions/31" target="_blank" flex="~ gap1" items-center op50 hover="op100 text-lime" transition>
            <div i-carbon-plan />
            Project Roadmap
          </a>
          <a href="https://github.com/nuxt/devtools/issues" target="_blank" flex="~ gap1" items-center op50 hover="op100 text-rose" transition>
            <div i-carbon-debug />
            Bug Reports
          </a>
          <VDropdown>
            <button flex="~ gap1" items-center mxa inline-block op50 hover:op80>
              <div i-carbon-settings />
              Settings
            </button>
            <template #popper>
              <Settings />
            </template>
          </VDropdown>
        </div>
      </div>
    </div>
  </div>
</template>
