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
  fetchItem(fileKey.value)
})

const filteredKeys = computed(() => {
  if (!keys.value)
    return []
  return keys.value.filter(key => key.includes(searchString.value))
})

async function fetchItem(key: string) {
  const content = await rpc.getStorageItem(key)
  current.value = {
    key: fileKey.value,
    content,
    updatedContent: content,
  }
}

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
  await fetchItem(current.value.key)
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
        icon="carbon-add"
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
          <NButton n="green xs" :disabled="current.content === current.updatedContent" :class="{ 'border-green': current.content !== current.updatedContent }" @click="saveCurrentItem">
            Save
          </NButton>
        </div>
        <div>
          <NButton n="red xs" @click="removeCurrentItem">
            Delete
          </NButton>
        </div>
      </div>
      <textarea v-if="typeof current.content === 'string'" v-model="current.updatedContent" class="of-auto h-full text-sm outline-none p-4" @keyup.ctrl.enter="saveCurrentItem" />
      <JsonEditorVue v-else v-model="current.updatedContent" :class="[$colorMode.value === 'dark' ? 'jse-theme-dark' : 'light']" class="json-editor-vue of-auto h-full text-sm outline-none" v-bind="$attrs" mode="text" :navigation-bar="false" :indentation="2" :tab-size="2" />
    </div>
    <div v-else flex items-center justify-center op50 text-center>
      <p>
        Select one key to start.<br>Learn more about <NLink href="https://nitro.unjs.io/guide/introduction/storage" n="orange" target="_blank">
          Nitro storage
        </NLink>
      </p>
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
