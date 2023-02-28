<script setup lang="ts">
import JsonEditorVue from 'json-editor-vue'
import 'vanilla-jsoneditor/themes/jse-theme-dark.css'

definePageMeta({
  icon: 'carbon-data-base',
  title: 'Storage',
  experimental: true,
})

const nuxtApp = useNuxtApp()
const router = useRouter()
const searchString = ref('')
const newKey = ref('')
const currentStorage = computed({
  get(): string | undefined {
    return useRoute().query?.storage as string | undefined
  },
  set(storage: string | undefined): void {
    router.replace({ query: { storage } })
  },
})
const currentItem = ref()
const fileKey = computed(() => useRoute().query?.key as string | undefined)

const { data: storageMounts } = await useAsyncData('storageMounts', () => rpc.getStorageMounts())
const { data: storageKeys, refresh: refreshStorageKeys } = await useAsyncData('storageKeys', async () => {
  if (currentStorage.value)
    return await rpc.getStorageKeys(currentStorage.value)

  return []
})

const closeWatcher = nuxtApp.hook('storage:key:update' as any, async (key: string, event) => {
  if (!currentStorage.value || key.split(':')[0] !== currentStorage.value)
    return
  await refreshStorageKeys()
  if (fileKey.value === key) {
    if (event === 'remove')
      return router.replace({ query: { storage: currentStorage.value } })
    await fetchItem(fileKey.value)
  }
})
onUnmounted(closeWatcher)

watch(currentStorage, refreshStorageKeys)

watchEffect(async () => {
  if (!fileKey.value) {
    currentItem.value = null
    return
  }
  fetchItem(fileKey.value)
})

function keyName(key: string) {
  return key.replace(`${currentStorage.value}:`, '')
}

const filteredKeys = computed(() => {
  if (!storageKeys.value)
    return []
  return storageKeys.value.filter(key => key.includes(searchString.value))
})

async function fetchItem(key: string) {
  const content = await rpc.getStorageItem(key)
  currentItem.value = {
    key,
    updatedKey: keyName(key),
    editingKey: false,
    content,
    updatedContent: content,
  }
}

async function saveNewItem() {
  if (!newKey.value || !currentStorage.value)
    return
  // If does not exists
  const key = `${currentStorage.value}:${newKey.value}`
  if (!storageKeys.value?.includes(key))
    await rpc.setStorageItem(key, '')

  router.replace({ query: { storage: currentStorage.value, key } })
  newKey.value = ''
}
async function saveCurrentItem() {
  if (!currentItem.value)
    return
  await rpc.setStorageItem(currentItem.value.key, currentItem.value.updatedContent)
  await fetchItem(currentItem.value.key)
}
async function removeCurrentItem() {
  if (!currentItem.value || !currentStorage.value)
    return
  await rpc.removeStorageItem(currentItem.value.key)
  currentItem.value = null
}
async function renameCurrentItem() {
  if (!currentItem.value || !currentStorage.value)
    return
  const renamedKey = `${currentStorage.value}:${currentItem.value.updatedKey}`
  await rpc.setStorageItem(renamedKey, currentItem.value.updatedContent)
  await rpc.removeStorageItem(currentItem.value.key)
  router.replace({ query: { storage: currentStorage.value, key: renamedKey } })
}
</script>

<template>
  <div v-if="currentStorage" grid="~ cols-[auto_1fr]" h-full of-hidden class="virtual-files">
    <div border="r base" of-auto w="300px">
      <div class="flex items-center justify-betwen gap-2 px-3 h-[50px]">
        <div class="w-full text-sm">
          <span text-gray>storage:</span>
          <select v-model="currentStorage" class="ml-2 p-1 bg-transparent">
            <option v-for="(_storage, name) of storageMounts" :key="name" :value="name">
              {{ name }}
            </option>
          </select>
        </div>
        <NIcon icon="carbon-close" class="op50 hover:op100 cursor-pointer" @click="currentStorage = ''" />
      </div>
      <NTextInput
        v-model="searchString"
        icon="carbon-search"
        placeholder="Search..."
        n="primary sm"
        class="w-full rounded-0 border-x-none outline-none"
      />
      <NuxtLink
        v-for="key of filteredKeys" :key="key"
        border="b base" px2 py1 text-sm font-mono block truncate
        :to="{ query: { key, storage: currentStorage } }"
        :class="key === currentItem?.key ? 'bg-truegray:20 text-base' : 'text-truegray'"
      >
        {{ keyName(key) }}
      </NuxtLink>
      <NTextInput
        v-model="newKey"
        icon="carbon-add"
        placeholder="key"
        n="sm"
        class="w-full outline-none border-0 border-b rounded-none"
        @keyup.enter="saveNewItem"
      />
    </div>
    <div v-if="currentItem?.key" h-full of-hidden flex="~ col">
      <div border="b base" class="text-sm op75 flex items-center h-[50px] px-4 justify-between">
        <div class="flex items-center gap-4">
          <NTextInput v-if="currentItem.editingKey" v-model="currentItem.updatedKey" @keyup.enter="renameCurrentItem" />
          <code v-else>{{ keyName(currentItem.key) }} <NIcon icon="carbon-edit" class="op50 hover:op100 cursor-pointer" @click="currentItem.editingKey = true" /></code>
          <NButton v-if="!currentItem.editingKey" n="green xs" :disabled="currentItem.content === currentItem.updatedContent" :class="{ 'border-green': currentItem.content !== currentItem.updatedContent }" @click="saveCurrentItem">
            Save
          </NButton>
        </div>
        <div>
          <NButton n="red xs" @click="removeCurrentItem">
            Delete
          </NButton>
        </div>
      </div>
      <JsonEditorVue v-if="typeof currentItem.content === 'object'" v-model="currentItem.updatedContent" :class="[$colorMode.value === 'dark' ? 'jse-theme-dark' : 'light']" class="json-editor-vue of-auto h-full text-sm outline-none" v-bind="$attrs" mode="text" :navigation-bar="false" :indentation="2" :tab-size="2" />
      <textarea v-else v-model="currentItem.updatedContent" placeholder="Item value..." class="of-auto h-full text-sm outline-none p-4" @keyup.ctrl.enter="saveCurrentItem" />
    </div>
    <div v-else flex items-center justify-center op50 text-center>
      <p>
        Select one key to start.<br>Learn more about <NLink href="https://nitro.unjs.io/guide/introduction/storage" n="orange" target="_blank">
          Nitro storage
        </NLink>
      </p>
    </div>
  </div>
  <div v-else grid="~" class="h-full of-hidden">
    <div class="flex gap-4 justify-center op50 text-center flex-col">
      <p v-if="Object.keys(storageMounts as any).length">
        Select one storage to start:
      </p>
      <p v-else>
        No custom storage defined in <code>nitro.storage</code>.<br>
        Learn more about <NLink href="https://nitro.unjs.io/guide/introduction/storage" n="orange" target="_blank">
          Nitro storage
        </nlink>
      </p>
      <div class="mx-auto">
        <NCard v-for="(storage, name) of storageMounts" :key="name" class="text-left p-4 cursor-pointer border mb-4 hover:border-green" @click="currentStorage = name">
          <span class="font-bold">{{ name }}</span><br>
          <span class="text-sm">{{ storage.driver }} driver</span><br>
          <span v-if="storage.base" class="text-xs font-mono">{{ storage.base }}</span>
        </NCard>
      </div>
    </div>
  </div>
</template>

<style scoped>
.json-editor-vue.light {
  --jse-theme-color: #ebebeb !important;
  --jse-theme-color-highlight: #bbb !important;
  --jse-background-color: #8881 !important;
  --jse-menu-color: #333 !important;
}
.json-editor-vue.jse-theme-dark {
  --jse-theme-color: #1d1d1d !important;
  --jse-theme-color-highlight: #333 !important;
  --jse-background-color: #8881 !important;
  --jse-menu-color: #aaa !important;
}
</style>
