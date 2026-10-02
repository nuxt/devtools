<script setup lang="ts">
const { count, inc, dec, reset } = useCounter()
const result = ref('')
const running = ref(false)

async function run(fn: () => unknown) {
  running.value = true
  try {
    result.value = String(await fn())
  }
  catch (e: any) {
    result.value = `error: ${e.message}`
  }
  finally {
    running.value = false
  }
}
</script>

<template>
  <div>
    <h2>Home</h2>
    <section>
      <h3>Counter (useCounter)</h3>
      <div data-testid="counter">
        count: {{ count }}
      </div>
      <button @click="inc()">
        +1
      </button>
      <button @click="dec()">
        -1
      </button>
      <button @click="reset()">
        reset
      </button>
    </section>
    <section>
      <h3>Timed functions</h3>
      <button :disabled="running" @click="run(fastTask)">
        fastTask
      </button>
      <button :disabled="running" @click="run(() => slowTask(800))">
        slowTask 800ms
      </button>
      <button :disabled="running" @click="run(() => slowTask(2500))">
        slowTask 2.5s
      </button>
      <button :disabled="running" @click="run(failingTask)">
        failingTask
      </button>
      <div data-testid="result">
        {{ running ? 'running…' : result }}
      </div>
    </section>
  </div>
</template>
