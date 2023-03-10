<script setup lang="ts">
import { useTimeAgo } from '@vueuse/core'
import type { AssetInfo } from '~/../src/types'

const props = defineProps<{
  asset: AssetInfo
}>()

const imageMeta = computedAsync(() => {
  if (props.asset.type !== 'image')
    return undefined
  return rpc.getImageMeta(props.asset.filePath)
})

const textContent = computedAsync(() => {
  if (props.asset.type !== 'text')
    return undefined
  return rpc.getTextAssetContent(props.asset.filePath)
})

const codeSnippets = computed(() => {
  if (props.asset.type === 'image') {
    const attrs = imageMeta.value?.width
      ? ` width="${imageMeta.value.width}" height="${imageMeta.value.height}" `
      : ' '
    return [
      ['html', `<nuxt-image${attrs}src="${props.asset.publicPath}" />`],
      ['html', `<img${attrs}src="${props.asset.publicPath}" />`],
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

const aspectRatio = computed(() => {
  if (!imageMeta.value?.width || !imageMeta.value?.height)
    return ''
  const gcd = (a: number, b: number): number => {
    if (!b)
      return a
    return gcd(b, a % b)
  }
  const ratio = gcd(imageMeta.value.width, imageMeta.value.height)
  if (ratio > 3)
    return `${imageMeta.value.width / ratio} : ${imageMeta.value.height / ratio}`
  return ''
})

const supportsPreview = computed(() => {
  return [
    'image',
    'text',
    'video',
  ].includes(props.asset.type)
})
</script>

<template>
  <div flex="~ col gap-4" w-full of-hidden p2 h-full of-auto>
    <template v-if="supportsPreview">
      <div op50 mb--2 flex="~ gap2" items-center>
        <div x-divider />
        <div flex-none>
          Preview
        </div>
        <div x-divider />
      </div>

      <div flex="~" items-center justify-center>
        <AssetPreview
          rounded max-h-80 w-auto min-h-20 min-w-20 border="~ base"
          :asset="asset"
          :text-content="textContent"
        />
      </div>
    </template>

    <div op50 mb--2 flex="~ gap2" items-center>
      <div x-divider />
      <div flex-none>
        Details
      </div>
      <div x-divider />
    </div>

    <table w-full>
      <tbody>
        <tr>
          <td op50 text-right pr5 w-max ws-nowrap>
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
          <td capitalize>
            {{ asset.type }}
          </td>
        </tr>
        <template v-if="imageMeta?.width">
          <tr>
            <td text-right op50 pr5 w-max ws-nowrap>
              Image Size
            </td>
            <td>{{ imageMeta.width }} x {{ imageMeta.height }}</td>
          </tr>
          <tr v-if="aspectRatio">
            <td text-right op50 pr5 w-max ws-nowrap>
              Aspect Ratio
            </td>
            <td>{{ aspectRatio }}</td>
          </tr>
        </template>
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

    <div op50 mb--2 flex="~ gap2" items-center>
      <div x-divider />
      <div flex-none>
        Actions
      </div>
      <div x-divider />
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
