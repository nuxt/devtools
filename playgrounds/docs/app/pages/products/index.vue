<script setup lang="ts">
const { data: products } = await useProducts()
</script>

<template>
  <section flex flex-col gap-6>
    <h1 text-3xl font-bold>
      Products
    </h1>
    <div grid grid-cols-3 gap-4>
      <ProductCard v-for="product in products" :key="product.id" :product="product" />
    </div>
  </section>
</template>
