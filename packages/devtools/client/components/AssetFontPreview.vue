<script setup lang="ts">
import { hash } from 'ohash'
import type { AssetInfo } from '~/../src/types'

const props = defineProps<{
  asset: AssetInfo
}>()

const id = computed(() => `devtools-assets-${hash(props.asset)}`)

useStyleTag(computed(() => `
  @font-face {
    font-family: '${id.value}';
    src: url('${props.asset.publicPath}');
  }
`))
</script>

<template>
  <div of-hidden :style="{ fontFamily: `'${id}'` }">
    Aa Bb Cc Dd Ee Ff Gg Hh Ii Jj Kk Ll Mm Nn Oo Pp Qq Rr Ss Tt Uu Vv Ww Xx Yy Zz
  </div>
</template>
