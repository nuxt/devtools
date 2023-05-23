<script setup lang="ts">
import type { SocialPreviewResolved } from '~/../src/types'

defineProps<{
  card: SocialPreviewResolved
}>()
</script>

<template>
  <div class="max-w-[524px] min-w-[524px] cursor-pointer bg-base">
    <div
      class="h-[274px] border border-b-0 border-base bg-cover bg-center bg-no-repeat"
      :style="{ backgroundImage: `url(${JSON.stringify(card.image)})` }"
    />
    <div class="break-words border border-base px-[12px] py-[10px] antialiased">
      <div class="overflow-hidden truncate whitespace-nowrap text-[12px] leading-[11px] uppercase op50">
        {{ card.url }}
      </div><div class="block h-[46px] max-h-[46px] border-separate select-none overflow-hidden break-words text-left" style="border-spacing: 0px;">
        <div class="mt-[3px] truncate pt-[2px] text-[16px] font-semibold leading-[20px]">
          {{ card.title }}
        </div><div
          class="mt-[3px] block h-[18px] max-h-[80px] border-separate select-none overflow-hidden truncate whitespace-nowrap break-words text-left text-[14px] leading-[20px] op50"
          style="-webkit-line-clamp: 1; border-spacing: 0px; -webkit-box-orient: vertical;"
        >
          {{ card.description }}
        </div>
      </div>
    </div>
  </div>
</template>
