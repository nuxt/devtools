<script setup lang="ts">
function run() {
  useFetch('/')
}

if (process.client) {
  setInterval(() => {
    useState('foo')
  }, 3000)
}
</script>

<template>
  <div>
    <button @click="run">
      Run
    </button>
    <button @click="sleep(Math.random() * 200 + 100)">
      Sleep
    </button>
    <button @click="doSomething">
      Do something
    </button>
  </div>
</template>
