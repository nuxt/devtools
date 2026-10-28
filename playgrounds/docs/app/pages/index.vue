<script setup lang="ts">
const { data: products } = await useProducts()

useSeoMeta({
  title: 'Nuxt Shop',
  description: 'A small shop built with Nuxt.',
  ogImage: '/og.png',
})
</script>

<template>
  <section flex flex-col gap-6>
    <h1 text-3xl font-bold>
      Featured products
    </h1>
    <div grid grid-cols-3 gap-4>
      <ProductCard v-for="product in products?.slice(0, 3)" :key="product.id" :product="product" />
    </div>
  </section>
</template>
