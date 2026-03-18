<script setup lang="ts">
const navigation = inject('navigation')
</script>

<template>
  <div>
    <UMain>
      <UContainer>
        <UPage>
          <template #left>
            <UPageAside>
              <template #top>
                <UContentSearchButton size="md" />
              </template>
              <UContentNavigation :navigation="navigation" />
            </UPageAside>
          </template>
          <slot />
        </UPage>
      </UContainer>
    </UMain>
  </div>
</template>
