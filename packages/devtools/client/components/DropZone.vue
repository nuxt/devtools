<script lang="ts" setup>
const props = defineProps({
  folder: {
    type: String,
    required: true,
  },
})

const emit = defineEmits(['uploaded'])
const showNotification = useNotification()

const visible = ref(false)
const lastTarget = ref()

const files = ref<File[]>([])
// TODO: add option to user to choose types
const uploadTypes: string[] = ['image', 'video']

function onDragEnter(e: DragEvent) {
  lastTarget.value = e.target
  visible.value = true
}
function onDragLeave(e: DragEvent) {
  if (e.target === lastTarget.value)
    visible.value = false
}
function onDragOver(e: DragEvent) {
  e.preventDefault()
}

function onDrop(e: DragEvent) {
  e.preventDefault()
  setFiles(e.dataTransfer!.files)
}

function setFiles(data: FileList | null) {
  const inputFiles = Array.from(data || [])
  if (inputFiles.length) {
    const newFiles: File[] = []
    const existingFileNames: string[] = files.value.map(file => file.name)
    for (const file of inputFiles) {
      if (existingFileNames.includes(file.name)) {
        let i = 1
        const [name, ext] = file.name.split('.')
        while (existingFileNames.includes(`${name} (${i}).${ext}`))
          i++
        const newFilename = `${name}-${i}.${ext}`
        const blob = new Blob([file], { type: file.type })
        const newFile = new File([blob], newFilename, { lastModified: Date.now() })
        newFiles.push(newFile)
        existingFileNames.push(newFilename)
      }
      else {
        if (file.type === '')
          showNotification('Folders and hidden files are not supported yet', 'carbon:face-dissatisfied')
        else if (uploadTypes.some(type => file.type.includes(type)))
          newFiles.push(file)
        else
          showNotification(`"${file.type}" file type is not allowed`, 'carbon:face-dizzy')
      }
    }
    files.value = [...files.value, ...newFiles]
  }
}

async function uploadFiles() {
  if (wsConnecting.value || wsError.value)
    return

  const readyFiles = []
  for (const file of files.value) {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    const result = await new Promise((resolve) => {
      reader.onload = () => resolve(reader.result as string)
    }) as string
    const data = result.split(';base64,').pop() as string
    readyFiles.push({
      name: file.name,
      data,
    })
  }
  await rpc.writeStaticAssets([...readyFiles], props.folder).then(() => {
    emit('uploaded')
    close()
    showNotification('Files uploaded successfully!', 'carbon:face-cool')
  }).catch((error) => {
    console.error(error)
    close()
    showNotification('Upload failed!', 'carbon:face-dizzy')
  })
  visible.value = false
}

function removeFile(index: number) {
  files.value?.splice(index, 1)
}

function blobIt(file: File) {
  return URL.createObjectURL(file)
}

function changeName(file: File, newName: string) {
  const [name, ext] = file.name.split('.')
  const baseName = newName.replace(/\.\w+$/, '')
  const newFileName = `${baseName}.${ext}`
  if (baseName.length === 0) {
    alert('File name must be at least 1 characters long')
    return name
  }
  Object.defineProperty(file, 'name', { value: newFileName, writable: false })
  files.value.splice(files.value.indexOf(file), 1, file)
  return file
}

function clearFiles() {
  files.value = []
}

function close() {
  visible.value = false
  clearFiles()
}

onMounted(() => {
  window.addEventListener('dragenter', onDragEnter)
  window.addEventListener('dragleave', onDragLeave)
  window.addEventListener('dragover', onDragOver)
  window.addEventListener('drop', onDrop)
})

onBeforeUnmount(() => {
  window.removeEventListener('dragenter', onDragEnter)
  window.removeEventListener('dragleave', onDragLeave)
  window.removeEventListener('dragover', onDragOver)
  window.removeEventListener('drop', onDrop)
})
</script>

<template>
  <div fixed top-0 left-10 right-0 bottom-0 z-10 backdrop-blur transition-all :class="visible ? 'opacity-100 visible' : 'opacity-0 invisible'">
    <NIconButton icon="carbon-close" absolute top-5 right-5 dark-bg-dark bg-light border shadow-lg rounded-lg z-20 p-6 @click="close" />
    <div v-if="!files?.length" flex justify-center items-center h-full w-full>
      <label for="drop-zone-input" text-3xl>
        <NIcon icon="carbon-cloud-upload" mr-2 /> Drop files here or click to select
      </label>
      <input id="drop-zone-input" type="file" multiple hidden @change="setFiles(($event.target as HTMLInputElement).files)">
    </div>
    <div v-else h-full w-full relative>
      <div grid="~ cols-minmax-8rem" absolute top-0 right-0 bottom-0 left-0 gap-20 p-30 overflow-auto>
        <div v-for="file, index of files" :key="file.name" relative w-50 h-50>
          <button absolute shadow-lg rounded-lg flex dark:bg-dark bg-white top--4 p-2 right--4>
            <NIcon icon="carbon-close" @click="removeFile(index)" />
          </button>
          <!-- <div rounded-t-lg items-center of-hidden justify-center flex p1 bg-active object-cover rounded w-40 h-40 border="~ base"> -->
          <img w-full h-full rounded-t-lg object-cover :src="blobIt(file)">
          <!-- </div> -->
          <input w-full type="text" :value="file.name" @change="changeName(file, ($event.target as HTMLInputElement).value)">
        </div>
      </div>
      <div fixed left-10 flex items-center justify-center bottom-10 right-10>
        <NButton v-if="files.length" p-2 backdrop-blur dark-bg-dark bg-white bg-opacity-50 mx-4 @click="clearFiles">
          <NIcon icon="carbon-close" /> Clear
        </NButton>
        <NButton :disabled="!files.length" :class="files.length ? 'bg-green-6 hover-bg-green-5 hover:text-white' : 'bg-gray-5'" backdrop-blur bg-opacity-50 p-2 @click="uploadFiles">
          <NIcon icon="carbon-cloud-upload" /> Upload Files
        </NButton>
      </div>
    </div>
  </div>
</template>

<style scoped>
.content:before {
  border: 5px dashed #fff;
  content: "";
  bottom: 60px;
  left: 60px;
  position: absolute;
  right: 60px;
  top: 60px;
}
</style>
