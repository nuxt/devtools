<script setup lang="ts">
import { useTimeAgo } from '@vueuse/core'
import type { AssetInfo, CodeSnippet } from '~/../src/types'

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

const config = useServerConfig()
const hasNuxtImage = computed(() => {
  const modules = config.value?._installedModules || []
  return modules.some(m => m.meta?.name === '@nuxt/image' || m.meta?.name === '@nuxt/image-edge')
})

const codeSnippets = computed(() => {
  const items: CodeSnippet[] = []
  if (props.asset.type === 'image') {
    const attrs = imageMeta.value?.width
      ? `\n  width="${imageMeta.value.width}"\n  height="${imageMeta.value.height}" `
      : ' '
    items.push(
      { lang: 'vue-html', code: `<img${attrs}\n  src="${props.asset.publicPath}"\n/>`, name: 'Plain Image' },
    )
    hasNuxtImage.value && items.push(
      { lang: 'vue-html', code: `<NuxtImage${attrs}\n  src="${props.asset.publicPath}"\n/>`, name: 'Nuxt Image', docs: 'https://image.nuxtjs.org/components/nuxt-img' },
      { lang: 'vue-html', code: `<NuxtPicture${attrs}\n  src="${props.asset.publicPath}"\n/>`, name: 'Nuxt Picture', docs: 'https://image.nuxtjs.org/components/nuxt-picture' },
    )
    return items
  }

  items.push({
    lang: 'html',
    code: `<a download href="${props.asset.publicPath}">\n  Download ${props.asset.path.split('/').slice(-1)[0]}\n</a>`,
    name: 'Download link',
  })
  return items
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
    return `${imageMeta.value.width / ratio}:${imageMeta.value.height / ratio}`
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
  <div flex="~ col gap-4" w-full of-hidden min-h-full p4>
    <template v-if="supportsPreview">
      <div flex="~ gap2" op50 items-center mb--2>
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

    <table w-full max-w-full table-fixed>
      <tbody>
        <tr>
          <td op50 text-right pr5 ws-nowrap w-30>
            Filepath
          </td>
          <td>
            <div flex="~ gap-1" items-center>
              <FilepathItem :filepath="asset.filePath" w-full line-break ws-normal text-left />
              <div flex-auto />
              <NIconButton
                title="Open in Editor"
                icon="carbon-launch"
                @click="openInEditor(asset.filePath)"
              />
            </div>
          </td>
        </tr>
        <tr>
          <td text-right op50 pr5 w-30 ws-nowrap>
            Public Path
          </td>
          <td>
            <div flex="~ gap-1" items-center>
              <div font-mono>
                {{ asset.publicPath }}
              </div>
              <div flex-auto />
              <NIconButton
                :to="asset.publicPath"
                icon="carbon-launch"
                target="_blank"
                title="Open in browser"
              />
              <NIconButton
                title="Copy public path"
                icon="carbon-copy"
                @click="copy(asset.publicPath)"
              />
            </div>
          </td>
        </tr>
        <tr>
          <td text-right op50 pr5 w-30 ws-nowrap>
            Type
          </td>
          <td capitalize>
            {{ asset.type }}
          </td>
        </tr>
        <template v-if="imageMeta?.width">
          <tr>
            <td text-right op50 pr5 w-30 ws-nowrap>
              Image Size
            </td>
            <td>{{ imageMeta.width }} x {{ imageMeta.height }}</td>
          </tr>
          <tr v-if="aspectRatio">
            <td text-right op50 pr5 w-30 ws-nowrap>
              Aspect Ratio
            </td>
            <td>{{ aspectRatio }}</td>
          </tr>
        </template>
        <tr>
          <td text-right op50 pr5 w-30 ws-nowrap>
            File size
          </td>
          <td>{{ fileSize }}</td>
        </tr>
        <tr>
          <td text-right op50 pr5 w-30 ws-nowrap>
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
      <NButton :to="asset.publicPath" download target="_blank" icon="carbon-download">
        Download
      </NButton>
      <NButton v-if="asset.type === 'image'" disabled icon="carbon-image-service">
        Optimize image (Coming soon)
      </NButton>
    </div>

    <div flex-auto />

    <CodeSnippets
      v-if="codeSnippets.length"
      border="t base"
      mx--4 mb--4
      :code-snippets="codeSnippets"
    />
  </div>
</template>
