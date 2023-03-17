<script setup lang="ts">
import { nanoid } from 'nanoid'

const props = defineProps<{
  packageName: string
  flags?: string[]
}>()

const info = useAsyncData(`npm:check:${props.packageName}`, () => rpc.checkForUpdateFor(props.packageName)).data
const agent = (await useAsyncData('npm:agent', () => rpc.getPackageManager())).data.value || 'npm'
const args = computed(() => [
  agent === 'yarn' ? 'add' : 'install',
  `${props.packageName}@latest`,
  ...props.flags || [],
  '--ignore-scripts',
])

const router = useRouter()

async function update() {
  const command = [agent, ...args.value].join(' ')
  if (!confirm(`Going to run "${command}", are you sure?`))
    return

  const id = `npm:${nanoid()}`

  await rpc.executeBashCommand({
    command: agent,
    args: args.value,
  }, {
    id,
    name: `Updating ${props.packageName}`,
    icon: 'i-mdi-npm-variant-outline text-red',
  })

  router.push(`/modules/terminals?id=${encodeURIComponent(id)}`)
}
</script>

<template>
  <slot :info="info" :update="update">
    <code v-if="info">{{ `v${info.current}` }}</code>
    <template v-if="info?.latest">
      <button v-if="info.needsUpdate" @click="update">
        <Badge
          bg-green-400:10 text-green-400
          title="updates available"
          v-text="'updates available'"
        />
      </button>
      <Badge
        v-else
        bg-gray-400:10 text-gray-400
        title="latest"
        v-text="'latest'"
      />
    </template>
  </slot>
</template>
