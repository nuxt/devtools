<script setup lang="ts">
</script>

<template>
  <div class="n-loading" n="primary">
    <span />
    <span />
    <span />
  </div>
</template>

<style scoped>
.n-loading span {
  display: inline-block;
  width: 3px;
  height: 20px;
  background-color: rgba(var(--nui-c-context), .1);
  border-radius: 10px;
  animation: loading 1s linear infinite;
}

span:nth-child(2) {
  height: 35px;
  margin: 0 5px;
  animation-delay: .25s;
}

span:nth-child(3) {
  animation-delay: .5s;
}

@keyframes loading {
  20% {
    background-color: rgba(var(--nui-c-context), 1);
    transform: scaleY(1.5);
  }

  40% {
    transform: scaleY(1);
  }
}
</style>
