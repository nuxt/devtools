<template>
  <div h-screen of-hidden grid="~ rows-[max-content_1fr]">
    <NavBar />
    <div grid="~ cols-[200px_1fr]" h-full>
      <Drawer />
      <NuxtPage />
    </div>
  </div>
</template>
