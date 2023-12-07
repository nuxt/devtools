<script setup lang="ts">
import type { SocialPreviewResolved } from '~/../src/types'

defineProps<{
  card: SocialPreviewResolved
}>()

const location = useBrowserLocation()
const time = useDateFormat(useNow(), 'HH:mm')
</script>

<template>
  <div class="relative max-w-[420px] min-w-[420px] rounded-[16px] rounded-bl-0 py-[6px] leading-[18px] drop-shadow-sm drop-shadow-color-[#10232f26] bg-base">
    <div class="pl-[10px] pr-[8px]">
      <div class="text-[#3390ec] leading-normal underline">
        {{ card.url }}
      </div>
      <div class="quote w-full flex">
        <div class="flex flex-col gap-1">
          <div v-if="card.image" class="my-[3px] overflow-hidden rounded">
            <img class="h-full max-w-full w-full rounded object-cover" :src="card.image">
          </div>

          <div class="cursor-pointer text-sm text-[#3390ec]">
            <strong>{{ location.hostname }}</strong>
          </div>

          <div class="cursor-pointer text-sm">
            <strong>{{ card.title }}</strong>
          </div>

          <div class="cursor-pointer text-sm">
            {{ card.description }}
          </div>
        </div>
      </div>

      <div class="flex justify-end text-xs text-[#707579]">
        <span>{{ time }}</span>
      </div>
    </div>

    <svg width="11" height="20" viewBox="0 0 11 20" xmlns="http://www.w3.org/2000/svg" class="absolute bottom-0 ml-[-8.4px] translate-y-px text-white">
      <g transform="translate(9 -14)" fill-rule="evenodd">
        <path id="corner-fill" d="M-6 16h6v17c-.193-2.84-.876-5.767-2.05-8.782-.904-2.325-2.446-4.485-4.625-6.48A1 1 0 01-6 16z" transform="matrix(1 0 0 -1 0 49)" fill="currentColor" />
      </g>
    </svg>
  </div>
</template>

<style scoped>
.quote::before {
  flex: 0 0 auto;
  width: 2px;
  border-radius: 2px;
  background-color: #3390ec;
  margin: 3px 8px 2px 0;
  content: '';
}
</style>
