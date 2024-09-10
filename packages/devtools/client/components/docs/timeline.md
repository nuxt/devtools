# Timeline

<p>
<blockquote text-orange bg-orange:10 py1>
This is an experimental feature
</blockquote>
</p>

Timeline tracks your route navigations and functions calls in your Nuxt application. It can be used to debug performance issues and to understand how your application works.

## Function calls

Nuxt DevTools tracks function calls by wrapping them in the build time. It works for functions referenced by auto-imports, or explicit imports through `import {} from '#imports'`.

```vue
<script setup>
import { useNuxtApp } from '#imports'
import { useMouse } from '@vueuse/core'

const route = useRoute() // tracked
const app = useNuxtApp() // tracked

// NOT tracked because it's directly imported
const mouse = useMouse()
</script>
```

By default, it tracks Nuxt provided composables as well as user defined functions. You can include/exclude functions by using the `include` and `exclude` options in the `nuxt.config.js` file.

```js
export default defineNuxtConfig({
  devtools: {
    timeline: {
      functions: {
        include: [
          // track `useMouse`
          'useMouse',
          // track all functions starting with `use`
          /^use[A-Z]/,
          // track all functions from @vueuse/core
          entry => entry.from === '@vueuse/core',
        ],
        exclude: [
          'useRouter'
        ]
      }
    }
  }
})
```
