<script setup lang="ts">
import type { NormalizedHeadTag } from '~/../src/types'

const props = defineProps<{
  tags: NormalizedHeadTag[]
}>()

const card = computed(() => getSocialPreviewCard(props.tags, {
  title: [{ tag: 'title' }],
  image: [{ tag: 'meta', name: 'twitter:image' }, { tag: 'meta', name: 'og:image' }],
  imageAlt: [{ tag: 'meta', name: 'twitter:image:alt' }],
  description: [{ tag: 'meta', name: 'twitter:description' }, { tag: 'meta', name: 'description' }],
  favicon: [{ tag: 'link', name: 'icon' }],
}))

const type = computed(() => {
  if (!card.value.image)
    return 'summary'
  return props.tags.find(tag => tag.tag === 'meta' && tag.name === 'twitter:card')?.value || 'summary_large_image'
})
</script>

<template>
  <div class="max-w-[438px] min-w-[438px] of-hidden border border-base rounded-[0.85714em] bg-base -outline-offset-1">
    <div
      class="cursor-pointer overflow-hidden leading-[1.3em]"
      :class="type === 'summary_large_image' ? '' : 'flex'"
      hover="bg-[#88888805]"
    >
      <div
        v-if="type === 'summary_large_image'"
        class="h-[220px] border-b border-base bg-cover bg-center bg-no-repeat"
        :style="{ backgroundImage: `url(${JSON.stringify(card.image)})` }"
      />
      <div
        v-else
        class="h-[122px] w-[122px] flex-none border-r border-base bg-cover bg-center bg-no-repeat"
        :style="{ backgroundImage: `url(${JSON.stringify(card.image)})` }"
      />
      <div class="break-words border-base p-[0.75em] antialiased" flex="~ col justify-center gap-1">
        <div class="mt-[0.32333em] overflow-hidden truncate whitespace-nowrap text-[14px] leading-[18px] lowercase op50">
          {{ card.url }}
        </div>
        <div class="m-0 truncate text-[14px] font-semibold leading-[19px]">
          {{ card.title }}
        </div>
        <div class="line-clamp-3 select-none overflow-hidden break-words text-left text-[14px] leading-[18px] op50">
          {{ card.description }}
        </div>
      </div>
    </div>
  </div>
</template>
