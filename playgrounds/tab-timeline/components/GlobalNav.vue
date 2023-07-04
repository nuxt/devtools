<template>
  <div px10 pt10 op50>
    Click to navigate and see the SEO tab
  </div>
  <button @click="run">
    Run
  </button>
  <button @click="sleep(Math.random() * 200 + 100)">
    Sleep
  </button>
  <button @click="doSomething">
    Do something
  </button>
  <div px10 py5 flex="~ gap-4">
    <NuxtLink to="/" active-class="text-green">
      Home
    </NuxtLink>
    <NuxtLink to="/empty" active-class="text-green">
      Empty
    </NuxtLink>
    <NuxtLink to="/dynamic-a" active-class="text-green">
      Dynamic A
    </NuxtLink>
    <NuxtLink to="/dynamic-b" active-class="text-green">
      Dynamic B
    </NuxtLink>
  </div>
</template>
