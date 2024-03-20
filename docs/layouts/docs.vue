<script setup lang="ts">
const navigation = inject('navigation')
</script>

<template>
  <div>
    <UMain>
      <UContainer>
        <UPage>
          <template #left>
            <UAside>
              <template #top>
                <UContentSearchButton size="md" />
              </template>
              <UNavigationTree :links="mapContentNavigation(navigation)" />
            </UAside>
          </template>
          <slot />
        </UPage>
      </UContainer>
    </UMain>
  </div>
</template>
