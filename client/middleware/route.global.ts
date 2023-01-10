export default defineNuxtRouteMiddleware((to) => {
  if (to.path === '/')
    return navigateTo('/modules/overview')
})
