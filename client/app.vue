<template>
  <div h-screen of-hidden grid="~ rows-[max-content_1fr]">
    <NavBar />
    <Notification />
    <div grid="~ cols-[200px_1fr]" h-full of-hidden>
      <Drawer of-auto />
      <div h-full of-auto>
        <NuxtPage />
      </div>
    </div>
  </div>
</template>
