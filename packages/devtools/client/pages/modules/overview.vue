<script setup lang="ts">
import { version } from '../../../package.json'

definePageMeta({
  icon: 'carbon-information',
  title: 'Overview',
  order: -100,
})

const client = useClient()
const config = useServerConfig()
const components = useComponents()
const autoImports = useAutoImports()
const routes = useAllRoutes()
const isMacOS = getIsMacOS()

const router = useRouter()
function goIntro() {
  isFirstVisit.value = true
  router.push('/')
}
</script>

<template>
  <div flex h-full w-full>
    <div v-if="!config">
      Loading...
    </div>
    <div v-else flex="~ col gap2" w-full h-full ma max-w-300 p10 px20>
      <div flex-auto />

      <!-- Banner -->
      <div flex="~ col" items-center mt-20>
        <div flex="~" items-center justify-center mt--10>
          <NuxtLogo h-18 />
          <button mr--16 mt--6 @click="goIntro">
            <Badge
              bg-green-400:10 text-green-400
              title="preview"
              v-text="'preview'"
            />
          </button>
        </div>
        <div text-sm mt--1 text-center op30 mb6>
          Nuxt DevTools
          <code>v{{ version }}</code>
        </div>
      </div>
      <!-- Main Grid -->
      <div flex="~ gap2 wrap">
        <div p4 theme-card-green flex="~ col auto">
          <div text-3xl logos-nuxt-icon />
          <NpmVersionCheck package-name="nuxt" :options="{ dev: true }" />
        </div>
        <template v-if="config">
          <NuxtLink v-if="config && config.pages && client" p4 theme-card-lime min-w-40 flex="~ col auto" to="/modules/pages">
            <div text-3xl carbon-tree-view-alt />
            <div>{{ routes.length }} pages</div>
          </NuxtLink>
          <NuxtLink v-if="config" p4 theme-card-lime min-w-40 flex="~ col auto" to="/modules/components">
            <div text-3xl i-carbon-assembly-cluster />
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
      <div flex="~ col gap2">
        <NTip
          v-if="showConnectionWarning"
          n="yellow5" icon="carbon-unlink" justify-center
        >
          Not connected to the client app, showing server-side data only. Use the embedded mode for full features.
        </NTip>
      </div>
      <div flex="~ gap-6 wrap" items-center justify-center mt-5>
        <a href="https://github.com/nuxt/devtools" target="_blank" flex="~ gap1" items-center op50 hover="op100 text-blue" transition>
          <div i-carbon-star />
          Star on GitHub
        </a>
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
        <NuxtLink to="/settings" flex="~ gap1" items-center op50 inline-block hover:op80>
          <div i-carbon-settings />
          Settings
        </NuxtLink>
      </div>
      <div flex-auto />
      <NTip n="green6" justify-center icon="carbon-keyboard">
        You can press
        <template v-if="isMacOS">
          <NButton n="xs green" class="px2">
            ⌥ Option
          </NButton>+<NButton n="xs green" class="px2">
            D
          </NButton>
        </template>
        <template v-else>
          <NButton n="xs green" class="px2">
            Alt
          </NButton>+<NButton n="xs green" class="px2">
            D
          </NButton>
        </template>
        to toggle the DevTools.
      </NTip>
    </div>
  </div>
</template>
