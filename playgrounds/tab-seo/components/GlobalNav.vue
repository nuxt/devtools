<script setup lang="ts">
const nd = useNuxtDevTools()
</script>

<template>
  <div px10 pt10 op50>
    Click to navigate and see the SEO tab
    <template v-if="nd">
      <button
        border="~ rounded gray/30" ml2 px2 hover="border-green text-green"
        @click="nd.devtools.navigate('/modules/open-graph')"
      >
        Open devtools
      </button>
    </template>
  </div>
  <div px10 py5 flex="~ gap-4">
    <NuxtLink to="/" active-class="text-green">
      Home
    </NuxtLink>
    <NuxtLink to="/empty" active-class="text-green">
      Empty
    </NuxtLink>
    <NuxtLink to="/full" active-class="text-green">
      Full
    </NuxtLink>
    <NuxtLink to="/dynamic-life" active-class="text-green">
      Dynamic Life
    </NuxtLink>
    <NuxtLink to="/dynamic-power" active-class="text-green">
      Dynamic Power
    </NuxtLink>
  </div>
</template>
