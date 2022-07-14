<script setup>
if (process.client) {
  import('./setup/unocss-runtime')
}

const router = useRouter()
const route = useRoute()

clientFunctions.refresh = (type) => {
  if (route.path.includes(type)) {
    router.replace({
      path: route.path,
      query: {
        t: Date.now()
      }
    })
  }
}
</script>

<template>
  <div h-screen font-sans of-hidden bg-base>
    <Notification />
    <div grid="~ cols-[1fr_220px]" h-full of-hidden>
      <div h-full of-auto>
        <NuxtPage :page-key="n => n.fullPath" />
      </div>
      <Drawer of-auto />
    </div>
  </div>
</template>
