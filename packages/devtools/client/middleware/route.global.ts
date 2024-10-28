import { defineNuxtRouteMiddleware, navigateTo } from '#imports'
import { isFirstVisit } from '~/composables/storage'

export default defineNuxtRouteMiddleware((to) => {
  if (isFirstVisit.value) {
    if (to.path !== '/')
      return navigateTo('/')
  }
  else if (to.path === '/') {
    return navigateTo('/modules/overview')
  }
})
