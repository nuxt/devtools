<script setup lang="ts">
import type { HeadTag } from '@vueuse/head'

const props = defineProps({
  tags: {
    type: Array as PropType<HeadTag[]>,
    required: true,
  },
})

const groups = [
  {
    name: 'facebook',
    tag: 'og',
    color: 'text-[#3b5998]',
    icon: 'carbon-logo-facebook',
  },
  {
    name: 'twitter',
    tag: 'twitter',
    color: 'text-[#00acee]',
    icon: 'carbon-logo-twitter',
  },
  {
    name: 'linkedin',
    tag: 'og',
    color: 'text-[#0072b1]',
    icon: 'carbon-logo-linkedin',
  },
  {
    name: 'google',
    tag: null,
    color: 'text-[#4285f4]',
    icon: 'carbon-logo-google',
  },
]

const selectedGroup = ref(groups[0])

const url = window.location.host
const urlOrigin = window.location.origin

const metaProps = computed(() => {
  const result = props.tags?.reduce((accumulator: any, currentTag) => {
    const tag = currentTag.tag

    if (!selectedGroup.value.tag) {
      if (tag === 'meta' && !currentTag.props.name?.includes(':'))
        accumulator[currentTag.props.name] = currentTag.props.content

      else if (tag === 'title')
        accumulator.title = currentTag.textContent

      else if (tag === 'link' && currentTag.props.rel === 'icon')
        accumulator.icon = currentTag.props.href
    }

    else if (currentTag.props.name?.startsWith(`${selectedGroup.value.tag}:`)) {
      accumulator[currentTag.props.name.replace(`${selectedGroup.value.tag}:`, '')] = currentTag.props.content
    }

    return accumulator
  }, {})

  return result ?? {}
})
</script>

<template>
  <div border="b base" pb4>
    <div mb2 flex justify-between>
      <NButton
        v-for="group of groups"
        :key="group.name"
        @click="selectedGroup = group"
      >
        <NIcon
          :icon="group.icon"
          h-5 w-5
          :class="group.name === selectedGroup.name ? selectedGroup.color : ''"
        />
      </NButton>
    </div>
    <div v-if="Object.keys(metaProps).length" border="~ base">
      <div v-if="selectedGroup.name === 'google'" p4>
        <div mb1 flex items-center>
          <img v-if="metaProps?.icon" width="35" mr2 rounded-full bg-white p2 :src="metaProps?.icon">
          <div flex="~ col">
            <div>{{ url }}</div>
            <small>{{ urlOrigin }}</small>
          </div>
        </div>
        <p text-lg>
          {{ metaProps?.title }}
        </p>
        <div text-secondary>
          {{ metaProps?.description }}
        </div>
      </div>
      <template v-else>
        <img :src="metaProps?.image" :alt="metaProps?.image">
        <div v-if="selectedGroup.name === 'facebook'" p2>
          <small>
            {{ url }}
          </small>
          <p text-lg font-bold>
            {{ metaProps?.title }}
          </p>
          <div text-sm text-secondary>
            {{ metaProps?.description }}
          </div>
        </div>
        <div v-else-if="selectedGroup.name === 'twitter'" p2>
          <p text-lg font-bold>
            {{ metaProps?.title }}
          </p>
          <div text-sm>
            {{ metaProps?.description }}
          </div>
          <small>
            {{ url }}
          </small>
        </div>
        <div v-else-if="selectedGroup.name === 'linkedin'" p2>
          <div text-lg font-bold>
            {{ metaProps?.title }}
          </div>
          <small>
            {{ url }}
          </small>
        </div>
      </template>
    </div>
    <div v-else text-center text-gray-500>
      <div mb2 min-h-30 w-full bg-active />
      No "{{ selectedGroup.name }}" meta tags found
    </div>
  </div>
</template>
