<script setup lang="ts">
import { useTimeAgo } from '@vueuse/core'
import type { AssetInfo } from '~/../src/types'

const props = defineProps<{
  asset: AssetInfo
}>()

const codeSnippets = computed(() => {
  if (props.asset.type === 'image') {
    return [
      ['html', `<NuxtImage src="${props.asset.publicPath}" />`],
      ['html', `<img src="${props.asset.publicPath}" />`],
    ]
  }
  if (props.asset.type === 'video')
    return [['html', `<video src="${props.asset.publicPath}" />`]]
})

const copy = useCopy()
const timeago = useTimeAgo(() => props.asset.mtime)
const fileSize = computed(() => {
  const size = props.asset.size
  if (size < 1024)
    return `${size} B`
  if (size < 1024 * 1024)
    return `${(size / 1024).toFixed(2)} KB`
  return `${(size / 1024 / 1024).toFixed(2)} MB`
})
</script>

<template>
  <div flex="~ col gap-4" p2 h-full of-auto w-full of-hidden>
    <div flex="~" items-center justify-center>
      <AssetPreview rounded max-h-80 w-auto min-h-20 min-w-20 border="~ base" :asset="asset" />
    </div>
    <table w-full>
      <tbody>
        <tr>
          <td text-right op50 pr5 w-max ws-nowrap>
            Filepath
          </td>
          <td ws-w>
            <FilepathItem :filepath="asset.filePath" />
          </td>
        </tr>
        <tr>
          <td text-right op50 pr5 w-max ws-nowrap>
            Public
          </td>
          <td>{{ asset.publicPath }}</td>
        </tr>
        <tr>
          <td text-right op50 pr5 w-max ws-nowrap>
            Type
          </td>
          <td>{{ asset.type }}</td>
        </tr>
        <tr>
          <td text-right op50 pr5 w-max ws-nowrap>
            File size
          </td>
          <td>{{ fileSize }}</td>
        </tr>
        <tr>
          <td text-right op50 pr5 w-max ws-nowrap>
            Last modified
          </td>
          <td>{{ new Date(asset.mtime).toLocaleString() }} <span op70>({{ timeago }})</span></td>
        </tr>
      </tbody>
    </table>

    <div op50 mb--2>
      Actions
    </div>
    <div flex="~ gap2 wrap">
      <NButton icon="i-carbon-code" @click="openInEditor(asset.filePath)">
        Open in Editor
      </NButton>
      <NButton icon="carbon-launch" :to="asset.publicPath" target="_blank">
        Open in browser
      </NButton>
      <NButton icon="carbon-copy" @click="copy(asset.publicPath)">
        Copy public path
      </NButton>
      <NButton v-if="asset.type === 'image'" disabled icon="carbon-image-service">
        Optimize image (WIP)
      </NButton>
    </div>

    <div flex-auto />

    <div v-if="codeSnippets?.length" n-code-block border="~ base rounded">
      <template v-for="cs, idx of codeSnippets" :key="idx">
        <div v-if="idx" x-divider />
        <div v-if="cs" of-hidden p2>
          <NCodeBlock :code="cs[1]" :lang="cs[0]" of-auto w-full :lines="false" px1 />
          <div flex justify-end pt2>
            <NButton icon="carbon-copy" n="sm primary" @click="copy(cs[1])">
              Copy snippet
            </NButton>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>
