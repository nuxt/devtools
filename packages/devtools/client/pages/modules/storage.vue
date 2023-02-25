<script setup lang="ts">
import JsonEditorVue from 'json-editor-vue'
import 'vanilla-jsoneditor/themes/jse-theme-dark.css'

definePageMeta({
  icon: 'carbon-data-base',
  title: 'Storage',
})

const router = useRouter()
const searchString = ref('')
const newKey = ref('')
const current = ref()
const fileKey = computed(() => useRoute().query?.key as string | undefined)

const { data: keys, refresh } = await useAsyncData('storage', () => rpc.getStorageKeys())

watchEffect(async () => {
  if (!fileKey.value) {
    current.value = null
    return
  }
  const content = await rpc.getStorageItem(fileKey.value)
  current.value = { key: fileKey.value, content, updatedContent: content }
})

const filteredKeys = computed(() => {
  if (!keys.value)
    return []
  return keys.value.filter(key => key.startsWith(searchString.value))
})
async function saveNewItem() {
  if (!newKey.value)
    return
  // If does not exists
  if (!keys.value?.includes(newKey.value))
    await rpc.setStorageItem(newKey.value, '')

  await refresh()
  router.push({ query: { key: newKey.value } })
  newKey.value = ''
}
async function saveCurrentItem() {
  if (!current.value)
    return
  await rpc.setStorageItem(current.value.key, current.value.updatedContent)
  current.value.content = current.value.updatedContent
}
async function removeCurrentItem() {
  if (!current.value)
    return
  await rpc.removeStorageItem(current.value.key)
  current.value = null
  await refresh()
}
</script>

<template>
  <div grid="~ cols-[auto_1fr]" h-full of-hidden class="virtual-files">
    <div border="r base" of-auto w="300px">
      <div class="flex items-center px-3 h-15">
        <NTextInput
          v-model="searchString"
          icon="carbon-search"
          placeholder="Search..."
          n="primary"
          class="w-full"
        />
      </div>
      <NuxtLink
        v-for="key of filteredKeys" :key="key"
        border="b base" px2 py1 text-sm font-mono block truncate
        :to="{ query: { key } }"
        :class="key === current?.key ? 'bg-truegray:20 text-base' : 'text-truegray'"
      >
        {{ key }}
      </NuxtLink>
      <NTextInput
        v-model="newKey"
        placeholder="new:key"
        n="sm"
        class="w-full outline-none border-0 border-b rounded-none"
        @keyup.enter="saveNewItem"
      />
    </div>
    <div v-if="current?.key" h-full of-hidden flex="~ col">
      <div border="b base" class="text-sm op75 flex items-center h-15 px-4 justify-between">
        <div class="flex gap-4 items-center">
          <code>{{ current.key }}</code>
          <NButton n="green xs" :disabled="current.content === current.updatedContent" @click="saveCurrentItem">
            Save
          </NButton>
        </div>
        <div>
          <NButton n="red xs" @click="removeCurrentItem">
            Delete
          </NButton>
        </div>
      </div>
      <textarea v-if="typeof current.content === 'string'" v-model="current.updatedContent" class="of-auto h-full text-sm outline-none p-4" />
      <JsonEditorVue v-else v-model="current.updatedContent" class="of-auto h-full text-sm outline-none" />
    </div>
    <span v-else flex items-center justify-center op50>Select one file to start</span>
  </div>
</template>
