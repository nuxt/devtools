<script setup lang="ts">
import { useTimeAgo } from '@vueuse/core'
import type { AssetInfo, CodeSnippet } from '~/../src/types'

const props = defineProps<{
  modelValue: AssetInfo
}>()

const emit = defineEmits<{ (...args: any): void }>()
const asset = useVModel(props, 'modelValue', emit, { passive: true })

const imageMeta = computedAsync(async () => {
  if (asset.value.type !== 'image')
    return undefined
  return rpc.getImageMeta(await ensureDevAuthToken(), asset.value.filePath)
})

const editDialog = ref(false)
const newTextContent = ref()
const textContentCounter = ref(0)
const textContent = computedAsync(async () => {
  if (asset.value.type !== 'text')
    return undefined

  // eslint-disable-next-line ts/no-unused-expressions
  textContentCounter.value

  const content = await rpc.getTextAssetContent(await ensureDevAuthToken(), asset.value.filePath)
  newTextContent.value = content
  return content
})

async function saveTextContent() {
  if (textContent.value !== newTextContent.value) {
    try {
      await rpc.writeStaticAssets(await ensureDevAuthToken(), [{
        path: asset.value.path,
        content: newTextContent.value,
        override: true,
      }], '')
      editDialog.value = false
      textContentCounter.value++
      devtoolsUiShowNotification({
        message: 'Updated',
        icon: 'i-carbon-checkmark',
        classes: 'text-green',
      })
    }
    catch (error) {
      console.error(error)
      devtoolsUiShowNotification({
        message: 'Something went wrong!',
        icon: 'i-carbon-warning',
        classes: 'text-red',
      })
    }
  }
}

const config = useServerConfig()
const hasNuxtImage = computed(() => {
  const modules = config.value?._installedModules || []
  return modules.some(m => m.meta?.name === '@nuxt/image' || m.meta?.name === '@nuxt/image-edge')
})

const codeSnippets = computed(() => {
  const items: CodeSnippet[] = []
  if (asset.value.type === 'image') {
    const attrs = imageMeta.value?.width
      ? `\n  width="${imageMeta.value.width}"\n  height="${imageMeta.value.height}" `
      : ' '
    items.push(
      { lang: 'vue-html', code: `<img${attrs}\n  src="${asset.value.publicPath}"\n/>`, name: 'Plain Image' },
    )
    if (hasNuxtImage.value) {
      items.push(
        { lang: 'vue-html', code: `<NuxtImg${attrs}\n  src="${asset.value.publicPath}"\n/>`, name: 'Nuxt Img', docs: 'https://image.nuxt.com/usage/nuxt-img' },
        { lang: 'vue-html', code: `<NuxtPicture${attrs}\n  src="${asset.value.publicPath}"\n/>`, name: 'Nuxt Picture', docs: 'https://image.nuxt.com/usage/nuxt-picture' },
      )
    }
    return items
  }

  items.push({
    lang: 'html',
    code: `<a download href="${asset.value.publicPath}">\n  Download ${asset.value.path.split('/').slice(-1)[0]}\n</a>`,
    name: 'Download link',
  })
  return items
})

const copy = useCopy()
const openInEditor = useOpenInEditor()
const timeAgo = useTimeAgo(() => asset.value.mtime)
const fileSize = computed(() => {
  const size = asset.value.size
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
    'audio',
    'font',
  ].includes(asset.value.type)
})

const deleteDialog = ref(false)
async function deleteAsset() {
  try {
    await rpc.deleteStaticAsset(await ensureDevAuthToken(), asset.value.filePath)
    asset.value = undefined as any
    deleteDialog.value = false
    devtoolsUiShowNotification({
      message: 'Asset deleted',
      icon: 'i-carbon-checkmark',
      classes: 'text-green',
    })
  }
  catch (error) {
    console.error(error)
    devtoolsUiShowNotification({
      message: 'Something went wrong!',
      icon: 'i-carbon-warning',
      classes: 'text-red',
    })
  }
}

const renameDialog = ref(false)
const newName = ref('')
async function renameAsset() {
  const parts = asset.value.filePath.split('/')
  const oldName = parts.slice(-1)[0].split('.').slice(0, -1).join('.')

  if (!newName.value || newName.value === oldName) {
    return devtoolsUiShowNotification({
      message: 'Please enter a new name',
      icon: 'i-carbon-warning',
      classes: 'text-orange',
    })
  }

  try {
    const extension = parts.slice(-1)[0].split('.').slice(-1)[0]
    const fullPath = `${parts.slice(0, -1).join('/')}/${newName.value}.${extension}`
    await rpc.renameStaticAsset(await ensureDevAuthToken(), asset.value.filePath, fullPath)
    asset.value = undefined as any
    renameDialog.value = false
    devtoolsUiShowNotification({
      message: 'Asset renamed',
      icon: 'i-carbon-checkmark',
      classes: 'text-green',
    })
  }
  catch (error) {
    console.error(error)
    devtoolsUiShowNotification({
      message: 'Something went wrong!',
      icon: 'i-carbon-warning',
      classes: 'text-red',
    })
  }
}
</script>

<template>
  <div flex="~ col gap-4" min-h-full w-full of-hidden p4>
    <template v-if="supportsPreview">
      <div flex="~ gap2" mb--2 items-center op50>
        <div x-divider />
        <div flex-none>
          Preview
        </div>
        <div x-divider />
      </div>

      <div flex="~" items-center justify-center>
        <AssetPreview
          detail
          max-h-80 min-h-20 min-w-20 w-auto rounded border="~ base"
          :asset="asset"
          :text-content="textContent"
        />
      </div>
    </template>

    <div flex="~ gap2" mb--2 items-center op50>
      <div x-divider />
      <div flex-none>
        Details
      </div>
      <div x-divider />
    </div>

    <table max-w-full w-full table-fixed>
      <tbody>
        <tr>
          <td w-30 ws-nowrap pr5 text-right op50>
            Filepath
          </td>
          <td>
            <div flex="~ gap-1" w-full items-center>
              <FilepathItem :filepath="asset.filePath" text-left />
              <NButton
                v-tooltip="'Open in Editor'"
                flex-none
                title="Open in Editor"
                icon="carbon-launch"
                :border="false"
                @click="openInEditor(asset.filePath)"
              />
            </div>
          </td>
        </tr>
        <tr>
          <td w-30 ws-nowrap pr5 text-right op50>
            Public Path
          </td>
          <td>
            <div flex="~ gap-1" w-full items-center of-hidden>
              <div flex-auto of-hidden truncate ws-pre font-mono>
                {{ asset.publicPath }}
              </div>
              <NButton
                v-tooltip="'Copy public path'"
                flex-none
                title="Copy public path"
                icon="carbon-copy"
                :border="false"
                @click="copy(asset.publicPath, 'assets-public-path')"
              />
              <NButton
                v-tooltip="'Open in browser'"
                flex-none
                :to="asset.publicPath"
                icon="carbon-launch"
                target="_blank"
                :border="false"
                title="Open in browser"
              />
            </div>
          </td>
        </tr>
        <tr>
          <td w-30 ws-nowrap pr5 text-right op50>
            Type
          </td>
          <td capitalize>
            {{ asset.type }}
          </td>
        </tr>
        <template v-if="imageMeta?.width">
          <tr>
            <td w-30 ws-nowrap pr5 text-right op50>
              Image Size
            </td>
            <td>{{ imageMeta.width }} x {{ imageMeta.height }}</td>
          </tr>
          <tr v-if="aspectRatio">
            <td w-30 ws-nowrap pr5 text-right op50>
              Aspect Ratio
            </td>
            <td>{{ aspectRatio }}</td>
          </tr>
        </template>
        <tr>
          <td w-30 ws-nowrap pr5 text-right op50>
            File size
          </td>
          <td>{{ fileSize }}</td>
        </tr>
        <tr>
          <td w-30 ws-nowrap pr5 text-right op50>
            Last modified
          </td>
          <td>{{ new Date(asset.mtime).toLocaleString() }} <span op70>({{ timeAgo }})</span></td>
        </tr>
      </tbody>
    </table>

    <div flex="~ gap2" mb--2 items-center op50>
      <div x-divider />
      <div flex-none>
        Actions
      </div>
      <div x-divider />
    </div>
    <div flex="~ gap2 wrap">
      <NButton :to="asset.publicPath" download target="_blank" icon="carbon-download" n="green">
        Download
      </NButton>
      <NButton v-if="asset.type === 'text'" icon="carbon-edit" n="cyan" @click="editDialog = !editDialog">
        Edit
      </NButton>
      <NButton icon="carbon-text-annotation-toggle" n="blue" @click="renameDialog = !renameDialog">
        Rename
      </NButton>
      <NButton icon="carbon-delete" n="red" @click="deleteDialog = !deleteDialog">
        Delete
      </NButton>
      <!-- TODO: integrate with Nuxt Image -->
      <!-- <NButton v-if="asset.type === 'image'" disabled icon="carbon-image-service">
        Optimize image (Coming soon)
      </NButton> -->
    </div>

    <div flex-auto />

    <CodeSnippets
      v-if="codeSnippets.length"
      border="t base"
      mx--4 mb--4
      :code-snippets="codeSnippets"
    />
  </div>
  <NDialog v-model="deleteDialog">
    <div flex="~ col gap-4" min-h-full w-full of-hidden p8>
      <span>
        Are you sure you want to delete this asset?
      </span>
      <div flex="~ gap2 wrap justify-center">
        <NButton icon="carbon-close" @click="deleteDialog = false">
          Cancel
        </NButton>
        <NButton icon="carbon-delete" n="red" @click="deleteAsset">
          Delete
        </NButton>
      </div>
    </div>
  </NDialog>
  <NDialog v-model="renameDialog">
    <div flex="~ col gap-4" min-h-full w-full of-hidden p8>
      <NTextInput v-model="newName" placeholder="New name" n="blue" />
      <div flex="~ gap2 wrap justify-center">
        <NButton icon="carbon-close" @click="renameDialog = false">
          Cancel
        </NButton>
        <NButton icon="carbon-text-annotation-toggle" n="blue" @click="renameAsset">
          Rename
        </NButton>
      </div>
    </div>
  </NDialog>
  <NDialog v-if="asset.type === 'text'" v-model="editDialog">
    <div flex="~ col gap-4" min-h-full w-full of-hidden p4>
      <textarea
        v-model="newTextContent"
        placeholder="Item value..."
        class="h-lg w-xl of-auto rounded-lg p-4 text-sm font-mono outline-none"
        @keydown.enter="saveTextContent"
      />
      <div flex justify-end gap-4>
        <NButton icon="carbon-close" @click="editDialog = false">
          Cancel
        </NButton>
        <NButton icon="carbon:save" n="primary" @click="saveTextContent">
          save
        </NButton>
      </div>
    </div>
  </NDialog>
</template>
