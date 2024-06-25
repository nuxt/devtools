<script setup lang="ts">
import type { NormalizedHeadTag } from '../../../src/types'

const props = defineProps<{
  tags: NormalizedHeadTag[]
}>()

const types = [
  'twitter',
  'facebook',
  'linkedin',
  'telegram',
]

const selected = useLocalStorage('nuxt-devtools-social-preview-tab', types[0])

const card = computed(() => getSocialPreviewCard(props.tags, {
  title: [{ tag: 'title' }],
  image: [{ tag: 'meta', name: 'og:image' }],
  imageAlt: [{ tag: 'meta', name: 'og:image:alt' }],
  description: [{ tag: 'meta', name: 'og:description' }, { tag: 'meta', name: 'description' }],
  favicon: [{ tag: 'link', name: 'icon' }],
}))
</script>

<template>
  <div flex="~ col" w-full>
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
    <div flex="~ items-center justify-center" flex-auto p4 n-panel-grids>
      <div v-if="selected === 'facebook'">
        <SocialFacebook :card="card" />
      </div>
      <div v-else-if="selected === 'twitter'">
        <SocialTwitter :tags="tags" />
      </div>
      <div v-else-if="selected === 'linkedin'">
        <SocialLinkedin :card="card" />
      </div>
      <div v-else-if="selected === 'telegram'">
        <SocialTelegram :card="card" />
      </div>
    </div>
  </div>
</template>
