<script setup lang="ts">
import JsonEditorVue from 'json-editor-vue'

const colorMode = getColorMode()
const nuxtApp = useNuxtApp()
const router = useRouter()
const searchString = ref('')
const newKey = ref('')
const currentStorage = useSessionState<string>('storage:current', '')
const currentItem = ref()
const fileKey = useSessionState<string>('storage:file:state', '')

const { data: storageMounts } = await useAsyncData('storageMounts', () => rpc.getStorageMounts())
const { data: storageKeys, refresh: refreshStorageKeys } = await useAsyncData('storageKeys', async () => {
  if (currentStorage.value)
    return await rpc.getStorageKeys(currentStorage.value)
  return []
})

const closeWatcher = nuxtApp.hook('storage:key:update' as any, async (key: string, event: any) => {
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

watch(currentStorage, () => {
  refreshStorageKeys()
  fileKey.value = ''
})

watchEffect(async () => {
  if (!fileKey.value) {
    currentItem.value = null
    return
  }
  fetchItem(fileKey.value)
})

// Save on Ctrl/Cmd + S
useEventListener('keydown', (e) => {
  if (e.key === 's' && (e.ctrlKey || e.metaKey)) {
    saveCurrentItem()
    e.preventDefault()
  }
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
  const content = await rpc.getStorageItem(await ensureDevAuthToken(), key)
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
    await rpc.setStorageItem(await ensureDevAuthToken(), key, '')

  router.replace({ query: { storage: currentStorage.value, key } })
  newKey.value = ''
}

async function saveCurrentItem() {
  if (!currentItem.value)
    return
  await rpc.setStorageItem(await ensureDevAuthToken(), currentItem.value.key, currentItem.value.updatedContent)
  await fetchItem(currentItem.value.key)
}

async function removeCurrentItem() {
  if (!currentItem.value || !currentStorage.value)
    return
  await rpc.removeStorageItem(await ensureDevAuthToken(), currentItem.value.key)
  currentItem.value = null
}

async function renameCurrentItem() {
  if (!currentItem.value || !currentStorage.value)
    return
  const renamedKey = `${currentStorage.value}:${currentItem.value.updatedKey}`
  const token = await ensureDevAuthToken()
  await rpc.setStorageItem(token, renamedKey, currentItem.value.updatedContent)
  await rpc.removeStorageItem(token, currentItem.value.key)
  router.replace({ query: { storage: currentStorage.value, key: renamedKey } })
}
</script>

<template>
  <NSplitPane v-if="currentStorage" storage-key="tab-storage">
    <template #left>
      <div class="h-[48px] flex items-center justify-between gap1 px-3">
        <NButton icon="carbon-chevron-left" ml--1 :border="false" @click="currentStorage = ''" />
        <div class="w-full text-sm">
          <NSelect v-model="currentStorage" n="primary" icon="carbon-data-base">
            <option v-for="(_storage, name) of storageMounts" :key="name" :value="name">
              {{ name }}
            </option>
          </NSelect>
        </div>
      </div>
      <NTextInput
        v-model="searchString"
        icon="carbon-search"
        placeholder="Search..."
        n="primary sm"
        border="y x-none base! rounded-0"
        class="w-full py2 ring-0!"
      />
      <template v-for="key of filteredKeys" :key="key">
        <button
          block w-full truncate px2 py1 text-start text-sm font-mono
          :class="key === currentItem?.key ? 'text-primary n-bg-active' : 'text-secondary hover:n-bg-hover'"
          @click="fileKey = key"
        >
          {{ keyName(key) }}
        </button>
        <div x-divider />
      </template>
      <NTextInput
        v-model="newKey"
        icon="carbon-add"
        placeholder="key"
        n="sm"
        border="t-none x-none base! rounded-0"
        class="w-full py2 font-mono ring-0!"
        @keyup.enter="saveNewItem"
      />
    </template>

    <template #right>
      <div v-if="currentItem?.key" h-full of-hidden flex="~ col">
        <div border="b base" class="h-[49px] flex flex-none items-center justify-between px-4 text-sm">
          <div class="flex items-center gap-4">
            <NTextInput v-if="currentItem.editingKey" v-model="currentItem.updatedKey" @keyup.enter="renameCurrentItem" />
            <code v-else>{{ keyName(currentItem.key) }} <NIcon icon="carbon-edit" class="cursor-pointer op50 hover:op100" @click="currentItem.editingKey = true" /></code>
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
        <JsonEditorVue
          v-if="typeof currentItem.content === 'object'"
          v-model="currentItem.updatedContent"
          :class="[colorMode === 'dark' ? 'jse-theme-dark' : 'light']"
          class="json-editor-vue h-full of-auto text-sm outline-none"
          v-bind="$attrs"
          :mode="('text' as any)"
          :navigation-bar="false"
          :indentation="2"
          :tab-size="2"
        />
        <textarea
          v-else v-model="currentItem.updatedContent"
          placeholder="Item value..."
          class="h-full of-auto p-4 text-sm font-mono outline-none"
          @keyup.ctrl.enter="saveCurrentItem"
        />
      </div>
      <NPanelGrids v-else>
        <NCard px6 py4>
          Select one key to start.<br>Learn more about
          <NLink href="https://nitro.unjs.io/guide/storage" n="orange" target="_blank">
            Nitro storage
          </NLink>
        </NCard>
      </NPanelGrids>
    </template>
  </NSplitPane>
  <NPanelGrids v-else>
    <p v-if="Object.keys(storageMounts as any).length" op50>
      Select one storage to start:
    </p>
    <p v-else>
      No custom storage defined in <code>nitro.storage</code>.<br>
      Learn more about
      <NLink href="https://nitro.unjs.io/guide/storage" n="orange" target="_blank">
        Nitro storage
      </NLink>
    </p>
    <NCard
      v-for="(storage, name) of storageMounts"
      :key="name"
      min-w-80 cursor-pointer p-4 text-left
      hover="border-green"
      @click="currentStorage = name as string"
    >
      <span font-bold>{{ name }}</span><br>
      <span text-sm>{{ storage.driver }} driver</span><br>
      <FilepathItem v-if="storage.base" text-xs :filepath="storage.base" />
    </NCard>
  </NPanelGrids>
</template>
