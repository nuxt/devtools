<template>
  <div class="n-loading">
    <div class="flex flex-col items-center text-lg animate-pulse">
      <div class="text-4xl op50 i-carbon-circle-dash animate-spin" />
      <slot>
        Loading...
      </slot>
    </div>
  </div>
</template>
