import { defineNuxtRouteMiddleware, navigateTo } from 'nuxt/app'
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
