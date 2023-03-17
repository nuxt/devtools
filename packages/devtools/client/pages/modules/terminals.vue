<script setup lang="ts">
definePageMeta({
  icon: 'carbon-terminal',
  title: 'Terminals',
  shouldShow() {
    return useTerminals().value?.length
  },
})

const terminals = useTerminals()
const route = useRoute()
const router = useRouter()

const selected = computed(() => {
  const id = route.query.id as string
  return terminals.value?.find(t => t.id === id)
})

watchEffect(() => {
  if (!route.query.id && terminals.value?.length)
    router.replace(`/modules/terminals?id=${encodeURIComponent(terminals.value[0].id)}`)
})
</script>

<template>
  <div v-if="terminals?.length" h-full w-full of-hidden grid="~ rows-[max-content_max-content_1fr]">
    <!-- TODO: Refactor to have general component -->
    <div ref="navbar" flex="~" border="b base" items-center navbar-glass flex-1>
      <NuxtLink
        v-for="t of terminals"
        :key="t.id" border="r base"
        flex="~ gap-2" items-center px3 py2
        :class="t.id === selected?.id ? 'bg-active' : ''"
        :to="`/modules/terminals?id=${encodeURIComponent(t.id)}` "
      >
        <NIcon v-if="t.icon " :icon="t.icon" />
        <span :class="t.id === selected?.id ? '' : 'op50'">
          {{ t.name }}
        </span>
      </NuxtLink>
    </div>

    <template v-if="selected">
      <TerminalView :id="selected.id" :key="selected.id" />
    </template>
    <template v-else>
      <div>
        Terminal not found
      </div>
    </template>
  </div>
  <div v-else h-full items-center flex justify-center>
    <em op50>No terminal attached</em>
  </div>
</template>

<style>
.xterm {
  padding-left: 1rem;
  padding-right: 1rem;
}
</style>
