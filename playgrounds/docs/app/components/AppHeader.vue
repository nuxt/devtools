<script setup lang="ts">
const { public: { siteName } } = useRuntimeConfig()
const { announcement } = useAppConfig()
</script>

<template>
  <header flex items-center gap-6 border-b border-neutral-800 pb-4>
    <NuxtLink to="/" text-xl text-green-400 font-bold>
      {{ siteName }}
    </NuxtLink>
    <nav flex gap-4 text-sm>
      <NuxtLink to="/products">
        Products
      </NuxtLink>
      <NuxtLink to="/about">
        About
      </NuxtLink>
    </nav>
    <span flex-1 text-xs op50>{{ announcement }}</span>
    <CartButton />
  </header>
</template>
