<template>
  <span class="gradient" />
</template>

<style scoped>
.gradient {
  position: fixed;
  top: 35vh;
  width: 100%;
  height: 30vh;
  background: radial-gradient(50% 50% at 50% 50%, #00dc82 0%, rgba(0, 220, 130, 0) 100%);
  filter: blur(180px);
  opacity: 0.6;
  z-index: -1;
}
</style>
