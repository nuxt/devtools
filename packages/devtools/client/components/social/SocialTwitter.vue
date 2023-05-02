<script setup lang="ts">
import type { SocialPreviewResolved } from '~/../src/types'

defineProps<{
  card: SocialPreviewResolved
}>()
</script>

<template>
  <!-- TODO: support small thumbnail and no image, etc. -->
  <div class="max-w-[438px] min-w-[438px] cursor-pointer overflow-hidden border border-base rounded-[0.85714em] leading-[1.3em] -outline-offset-1">
    <div
      class="h-[220px] border-b border-base bg-cover bg-center bg-no-repeat"
      :style="{ backgroundImage: `url(${JSON.stringify(card.image)})` }"
    /><div class="break-words border-base p-[0.75em] antialiased">
      <div class="block border-separate select-none overflow-hidden break-words text-left" style="border-spacing: 0px;">
        <div class="m-0 mb-[0.15em] truncate text-[14px] font-semibold leading-[18px]">
          {{ card.title }}
        </div><div
          class="mt-[.32333em] block max-h-[2.6em] border-separate select-none overflow-hidden truncate whitespace-nowrap break-words text-left text-[14px] leading-[18px]"
          style="-webkit-line-clamp: 1; border-spacing: 0px; -webkit-box-orient: vertical;"
        >
          {{ card.description }}
        </div>
      </div><div class="mt-[0.32333em] overflow-hidden truncate whitespace-nowrap text-[14px] leading-[18px] lowercase op50">
        {{ card.url }}
      </div>
    </div>
  </div>
</template>
