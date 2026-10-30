<script setup lang="ts">
import type { Product } from '~~/server/utils/products'

defineProps<{ product: Product }>()

const { add } = useCart()
</script>

<template>
  <article flex flex-col gap-2 border border-neutral-800 rounded-lg p-4>
    <NuxtLink :to="`/products/${product.id}`" font-semibold>
      {{ product.name }}
    </NuxtLink>
    <p text-sm op60>
      {{ product.description }}
    </p>
    <div flex items-center justify-between>
      <PriceTag :price="product.price" />
      <button text-sm text-green-400 @click="add(product.id)">
        Add to cart
      </button>
    </div>
  </article>
</template>
