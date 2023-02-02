<template>
  <div of-hidden bg-base h-screen font-sans>
    <Notification />
    <div grid="~ cols-[1fr_45px] lg:cols-[1fr_200px]" h-full of-hidden>
      <div h-full of-auto>
        <slot />
      </div>
      <Drawer of-auto />
    </div>
  </div>
</template>
