<script setup lang="ts">
import PiniaLogo from '~/components/PiniaLogo.vue'

const counter = useCounter()

// if (process.server) {
//   counter.n = 20
// }
</script>

<template>
  <div>
    <div style="margin: 1rem 0">
      <PiniaLogo />
    </div>

    <p>
      This is an example store to test out devtools. Try one of the following
      with the devtools open:
      <br>
    </p>

    <ol>
      <li>Use the different increment actions</li>
      <li>Change the counter directly from the devtools</li>
      <li>Use decrement to zero to see how action groups work</li>
      <li>
        Click
        <b>Test Errors</b> and immediately after <b>increment</b> the store
      </li>
      <li>
        While the dev server is running, try changing counter.changeMe, adding,
        and removing new state properties
      </li>
    </ol>

    <h2>Counter Store</h2>

    <p data-testid="counter-values">
      Counter: {{ counter.n }}. Double: {{ counter.double }}
    </p>

    <p>Increment the Store:</p>

    <button data-testid="increment" @click="counter.increment()">
      +1
    </button>
    <button @click="counter.increment(10)">
      +10
    </button>
    <button @click="counter.increment(100)">
      +100
    </button>
    <button @click="counter.n++">
      Direct Increment
    </button>
    <button
      @click="
        counter.$patch((state) => {
          state.n++
          state.incrementedTimes++
        })
      "
    >
      Direct patch
    </button>

    <p>Other actions:</p>

    <button @click="counter.fail">
      Test Errors
    </button>
    <button @click="counter.decrementToZero()">
      Decrement to zero
    </button>
    <button @click="counter.changeMe()">
      <code>counter.changeMe()</code>
    </button>

    <hr>

    <p>
      Complete store state via
      <code>store.$state</code>:
    </p>

    <pre>{{ counter.$state }}</pre>
  </div>
</template>

<style scoped>
button {
  margin-right: 0.5rem;
  margin-bottom: 0.5rem;
}
</style>
