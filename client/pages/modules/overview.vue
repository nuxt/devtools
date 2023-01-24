<script setup lang="ts">
definePageMeta({
  icon: 'carbon-information',
  title: 'Overview',
  order: -1,
})

const config = $(useServerConfig())
const { data: versions } = useAsyncData(() => rpc.getVersions())

const components = await rpc.getComponents()
const { imports: autoImports } = await rpc.getAutoImports()
</script>

<template>
  <div h-full w-full flex>
    <div w-full max-w-300 ma flex="~ col gap6" p4>
      <!-- Banner -->
      <div flex="~ col" items-center>
        <div mt--10 flex="~ gap2" justify-center items-center>
          <img src="/nuxt.svg" h-12>
          <div text-4xl font-bold>
            DevTools
          </div>
        </div>
      </div>
      <!-- Main Grid -->
      <div flex="~ gap2 wrap">
        <div p5 theme-card-green flex="~ col auto">
          <div logos-nuxt-icon text-3xl />
          <code>{{ versions?.nuxt ? `v${versions.nuxt}` : 'Unknown' }}</code>
        </div>
        <template v-if="config">
          <NuxtLink v-if="config" p5 theme-card-lime min-w-40 flex="~ col auto" to="/modules/components">
            <div carbon-nominal text-3xl />
            <div>{{ components.length }} components</div>
          </NuxtLink>
          <NuxtLink v-if="config" p5 theme-card-yellow min-w-40 flex="~ col auto" to="/modules/composables">
            <div carbon-function text-3xl />
            <div>{{ autoImports.length }} composables</div>
          </NuxtLink>
          <NuxtLink v-if="config" p5 theme-card-purple min-w-40 flex="~ col auto" to="/modules/modules">
            <div carbon-3d-mpr-toggle text-3xl />
            <div>{{ config._installedModules.length }} modules</div>
          </NuxtLink>
          <NuxtLink v-if="config" p5 theme-card-teal min-w-40 flex="~ col auto" to="/modules/plugins">
            <div carbon-plug text-3xl />
            <div>{{ config.plugins.length }} plugins</div>
          </NuxtLink>
        </template>
      </div>
      <!-- <div bg-red:10 flex-full /> -->
      <div flex="~ col gap2">
        <div
          px4 theme-banner-lime justify-center
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
    </div>
  </div>
</template>
