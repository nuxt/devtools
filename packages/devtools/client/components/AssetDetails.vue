<script setup lang="ts">
import { useTimeAgo } from '@vueuse/core'
import type { AssetInfo } from '~/../src/types'

const props = defineProps<{
  asset: AssetInfo
}>()

const codeSnippet = computed(() => {
  if (props.asset.type === 'image')
    // TODO: NuxtImage when available
    return `<img src="${props.asset.publicPath}" />`
  if (props.asset.type === 'video')
    return `<video src="${props.asset.publicPath}" />`
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
      <AssetPreview rounded max-h-50 w-auto border="~ base" :asset="asset" />
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
      <NButton icon="carbon-launch" @click="openInEditor(asset.filePath)">
        Open in Editor
      </NButton>
      <NButton icon="carbon-copy" @click="copy(asset.publicPath)">
        Copy public path
      </NButton>
      <NButton v-if="asset.type === 'image'" disabled icon="carbon-image-service">
        Optimize image (WIP)
      </NButton>
    </div>

    <div flex-auto />

    <div v-if="codeSnippet" border="~ base rounded" p2 of-hidden n-code-block>
      <NCodeBlock :code="codeSnippet" lang="html" of-auto w-full :lines="false" px1 />
      <div flex justify-end pt2>
        <NButton icon="carbon-copy" n="sm primary" @click="copy(codeSnippet!)">
          Copy snippet
        </NButton>
      </div>
    </div>
  </div>
</template>
