<script setup>
const router = useRouter()
const route = useRoute()

clientFunctions.refresh = (type) => {
  if (route.path.includes(type)) {
    router.replace({
      path: route.path,
      query: {
        t: Date.now(),
      },
    })
  }
}
</script>

<template>
  <div h-screen font-sans of-hidden bg-base>
    <Notification />
    <div grid="~ cols-[200px_1fr]" h-full of-hidden>
      <Drawer of-auto />
      <div h-full of-auto>
        <NuxtPage :page-key="n => n.fullPath" />
      </div>
    </div>
    <div fixed top-0 right-0 w-10 h-10 bg-base border="l b base" rounded-bl-lg flex>
      <div carbon-close text-2xl op50 hover:op100 ma />
    </div>
  </div>
</template>
