<template>
  <div h-screen font-sans of-hidden bg-base>
    <Notification />
    <div grid="~ cols-[1fr_45px] md:cols-[1fr_200px]" h-full of-hidden>
      <div h-full of-auto>
        <slot />
      </div>
      <Drawer of-auto />
    </div>
  </div>
</template>
