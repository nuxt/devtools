<script setup lang="ts">
definePageMeta({
  icon: 'carbon-information',
  title: 'Overview',
  order: -100,
})

const router = useRouter()
const config = $(useServerConfig())
const { data: versions } = useAsyncData('getVersions', () => rpc.getVersions())

const nuxtVersion = computed(() => versions.value?.find(v => v.name === 'nuxt'))

const components = await rpc.getComponents()
const { imports: autoImports } = await rpc.getAutoImports()

function goIntro() {
  isFirstVisit.value = true
  router.push('/')
}
</script>

<template>
  <div h-full w-full flex>
    <div w-full max-w-300 ma flex="~ col gap2" p10>
      <!-- Banner -->
      <div flex="~ col" items-center>
        <div mt--10 flex="~" justify-center items-center>
          <NuxtLogo h-16 />
          <button mr--20 mt--5 @click="goIntro">
            <Badge
              bg-green-400:10 text-green-400
              title="preview"
              v-text="'preview'"
            />
          </button>
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
          <NuxtLink v-if="config" p4 theme-card-lime min-w-40 flex="~ col auto" to="/modules/components">
            <div carbon-nominal text-3xl />
            <div>{{ components.length }} components</div>
          </NuxtLink>
          <NuxtLink v-if="config" p4 theme-card-yellow min-w-40 flex="~ col auto" to="/modules/imports">
            <div carbon-function text-3xl />
            <div>{{ autoImports.length }} imports</div>
          </NuxtLink>
          <NuxtLink v-if="config" p4 theme-card-purple min-w-40 flex="~ col auto" to="/modules/modules">
            <div carbon-3d-mpr-toggle text-3xl />
            <div>{{ config._installedModules.length }} modules</div>
          </NuxtLink>
          <NuxtLink v-if="config" p4 theme-card-teal min-w-40 flex="~ col auto" to="/modules/plugins">
            <div carbon-plug text-3xl />
            <div>{{ config.plugins.length }} plugins</div>
          </NuxtLink>
        </template>
      </div>
      <!-- <div bg-red:10 flex-full /> -->
      <div flex="~ col gap2">
        <div
          px4 theme-banner-green justify-center
        >
          <span carbon-chemistry flex-none />Working in Progress. For early preview only.
        </div>
        <div
          v-if="showConnectionWarning"
          px4 theme-banner-yellow justify-center
        >
          <span i-carbon-unlink flex-none />Not connected to the client, showing server-side data only. Use the embedded mode for full features.
        </div>
      </div>

      <div flex="~ col" items-center mt-5>
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
</template>
