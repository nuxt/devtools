import { isFirstVisit } from '~/composables/storage'

export default defineNuxtRouteMiddleware((to) => {
  if (to.path === '/' && !isFirstVisit.value)
    return navigateTo('/modules/overview')
})
