export default defineNuxtRouteMiddleware(() => {
  useState('page-views', () => 0).value++
})
