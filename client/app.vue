<template>
  <div h-screen font-sans of-hidden>
    <Notification />
    <div grid="~ cols-[200px_1fr]" h-full of-hidden>
      <Drawer of-auto />
      <div h-full of-auto>
        <NuxtPage />
      </div>
    </div>
    <div fixed top-0 right-0 w-10 h-10 bg-base border="l b base" rounded-bl-lg />
  </div>
</template>
