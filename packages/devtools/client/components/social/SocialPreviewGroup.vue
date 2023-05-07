<script setup lang="ts">
import type { NormalizedHeadTag, SocialPreviewResolved } from '../../../src/types'

const props = defineProps<{
  tags: NormalizedHeadTag[]
}>()

const types = [
  'twitter',
  'facebook',
  'linkedin',
]

const selected = ref(types[0])

const card = computed((): SocialPreviewResolved => {
  return {
    url: window.location.host,
    title: props.tags.find(tag => tag.tag === 'title')?.value,
    image: props.tags.find(tag => tag.tag === 'meta' && tag.name === 'og:image')?.value,
    imageAlt: props.tags.find(tag => tag.tag === 'meta' && tag.name === 'og:image:alt')?.value,
    description: props.tags.find(tag => tag.tag === 'meta' && tag.name === 'og:description')?.value,
    favicon: props.tags.find(tag => tag.tag === 'link' && tag.name === 'icon')?.value,
  }
})
</script>

<template>
  <div h-full w-max flex="~ col">
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
    <div flex="~ items-center justify-center" flex-auto p4>
      <div v-if="selected === 'facebook'">
        <SocialFacebook :card="card" />
      </div>
      <div v-else-if="selected === 'twitter'">
        <SocialTwitter :tags="tags" />
      </div>
      <div v-else-if="selected === 'linkedin'">
        <SocialLinkedin :card="card" />
      </div>
    </div>
  </div>
</template>
