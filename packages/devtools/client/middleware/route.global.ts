import { isFirstVisit } from '~/composables/storage'

export default defineNuxtRouteMiddleware((to) => {
  if (isFirstVisit.value) {
    if (to.path !== '/')
      navigateTo('/')
  }
  else if (to.path === '/') {
    navigateTo('/modules/overview')
  }
})
