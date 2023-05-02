<script setup lang="ts">
import type { HeadTag } from '@unhead/vue'
import type { SocialPreviewResolved } from '../../src/types'

const props = defineProps({
  tags: {
    type: Array as PropType<HeadTag[]>,
    required: true,
  },
})

const types = [
  'twitter',
  'facebook',
  'linkedin',
]

const selected = ref(types[0])

const card = computed((): SocialPreviewResolved => {
  return {
    url: window.location.host,
    title: props.tags.find(tag => tag.tag === 'title')?.textContent,
    image: props.tags.find(tag => tag.tag === 'meta' && tag.props.property === 'og:image')?.props.content,
    imageAlt: props.tags.find(tag => tag.tag === 'meta' && tag.props.property === 'og:image:alt')?.props.content,
    description: props.tags.find(tag => tag.tag === 'meta' && tag.props.property === 'og:description')?.props.content,
    favicon: props.tags.find(tag => tag.tag === 'link' && tag.props.rel === 'icon')?.props.href,
  }
})
</script>

<template>
  <div h-full w-525px flex="~ col">
    <div flex="~ wrap" w-full flex-none>
      <template v-for="name, idx of types" :key="idx">
        <button
          px4 py2 border="r base"
          hover="bg-active"
          :class="name === selected ? '' : 'border-b'"
          @click="selected = name"
        >
          <div :class="name === selected ? '' : 'op30' " capitalize>
            {{ name }}
          </div>
        </button>
      </template>
      <div border="b base" flex-auto />
    </div>
    <div flex="~ items-center justify-center" flex-auto>
      <div v-if="selected === 'facebook'">
        <SocialFacebook :card="card" />
      </div>
      <div v-else-if="selected === 'twitter'">
        <SocialTwitter :card="card" />
      </div>
      <div v-else-if="selected === 'linkedin'">
        <SocialLinkedin :card="card" />
      </div>
    </div>
  </div>
</template>
