<script setup lang="ts">
const a = useCounter('a')
const b = useCounter('b')
const once = useState('once', () => 0)

await callOnce(async () => {
  await slowTask(300)
  once.value++
})
</script>

<template>
  <div>
    <h2>State</h2>
    <div data-testid="once">
      callOnce ran: {{ once }}
    </div>
    <div>
      A: {{ a.count.value }}
      <button @click="a.inc()">
        +
      </button>
    </div>
    <div>
      B: {{ b.count.value }}
      <button @click="b.inc()">
        +
      </button>
    </div>
  </div>
</template>
