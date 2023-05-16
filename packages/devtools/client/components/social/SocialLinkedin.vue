<script setup lang="ts">
import type { SocialPreviewResolved } from '~/../src/types'

defineProps<{
  card: SocialPreviewResolved
}>()
</script>

<template>
  <div class="max-w-[520px] min-w-[520px] cursor-pointer overflow-hidden border border-base rounded-[2px] shadow-md bg-base">
    <div
      class="h-[270px] border-b border-base bg-cover bg-center bg-no-repeat"
      :style="{ backgroundImage: `url(${JSON.stringify(card.image)})` }"
    /><div class="break-words p-[10px] antialiased">
      <div class="block h-auto max-h-[50px] border-separate select-none break-words text-left" style="border-spacing: 0px;">
        <div class="pb-[2px] text-[16px] font-semibold leading-[24px]">
          {{ card.title }}
        </div><div class="overflow-hidden truncate whitespace-nowrap text-xs font-normal uppercase op85">
          {{ card.url }}
        </div>
      </div>
    </div>
  </div>
</template>
