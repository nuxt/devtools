<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
})

const route = useRoute()
const { data: product } = await useFetch(`/api/products/${route.params.id}`)
</script>

<template>
  <section v-if="product" flex flex-col gap-4>
    <h1 text-3xl font-bold>
      {{ product.name }}
    </h1>
    <p op60>
      {{ product.description }}
    </p>
    <PriceTag :price="product.price" />
  </section>
</template>
