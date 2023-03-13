<script setup lang="ts">
import JsonEditorVue from 'json-editor-vue'

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

watch(currentStorage, refreshStorageKeys)

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
  <PanelLeftRight v-if="currentStorage" storage-key="tab-storage">
    <template #left>
      <div class="items-center flex justify-between px-3 h-[48px] gap1">
        <NIconButton icon="carbon-chevron-left" ml--1 @click="currentStorage = ''" />
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
        <NuxtLink
          text-sm px2 py1 font-mono block truncate
          :to="{ query: { key, storage: currentStorage } }"
          :class="key === currentItem?.key ? 'text-primary n-bg-active' : 'text-secondary hover:n-bg-hover'"
        >
          {{ keyName(key) }}
        </NuxtLink>
        <div x-divider />
      </template>
      <NTextInput
        v-model="newKey"
        icon="carbon-add"
        placeholder="key"
        n="sm"
        border="t-none x-none base! rounded-0"
        class="w-full py2 ring-0! font-mono"
        @keyup.enter="saveNewItem"
      />
    </template>

    <template #right>
      <div v-if="currentItem?.key" h-full of-hidden flex="~ col">
        <div border="b base" class="text-sm flex items-center justify-between flex-none px-4 h-[49px]">
          <div class="flex items-center gap-4">
            <NTextInput v-if="currentItem.editingKey" v-model="currentItem.updatedKey" @keyup.enter="renameCurrentItem" />
            <code v-else>{{ keyName(currentItem.key) }} <NIcon icon="carbon-edit" class="op50 cursor-pointer hover:op100" @click="currentItem.editingKey = true" /></code>
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
          :class="[$colorMode.value === 'dark' ? 'jse-theme-dark' : 'light']"
          class="h-full text-sm json-editor-vue of-auto outline-none"
          v-bind="$attrs" mode="text" :navigation-bar="false" :indentation="2" :tab-size="2"
        />
        <textarea
          v-else v-model="currentItem.updatedContent"
          placeholder="Item value..."
          class="of-auto h-full text-sm outline-none font-mono p-4"
          @keyup.ctrl.enter="saveCurrentItem"
        />
      </div>
      <div v-else flex items-center op50 h-full justify-center text-center>
        <p>
          Select one key to start.<br>Learn more about <NLink href="https://nitro.unjs.io/guide/introduction/storage" n="orange" target="_blank">
            Nitro storage
          </NLink>
        </p>
      </div>
    </template>
  </PanelLeftRight>
  <div v-else grid="~" class="h-full of-hidden">
    <div class="flex gap-4 justify-center op50 text-center flex-col">
      <p v-if="Object.keys(storageMounts as any).length">
        Select one storage to start:
      </p>
      <p v-else>
        No custom storage defined in <code>nitro.storage</code>.<br>
        Learn more about <NLink href="https://nitro.unjs.io/guide/storage" n="orange" target="_blank">
          Nitro storage
        </NLink>
      </p>
      <div class="mx-auto">
        <NCard v-for="(storage, name) of storageMounts" :key="name" class="p-4 cursor-pointer text-left border mb-4 hover:border-green" @click="currentStorage = name">
          <span class="font-bold">{{ name }}</span><br>
          <span class="text-sm">{{ storage.driver }} driver</span><br>
          <span v-if="storage.base" class="font-mono text-xs">{{ storage.base }}</span>
        </NCard>
      </div>
    </div>
  </div>
</template>
