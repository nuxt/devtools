import { defineNuxtRouteMiddleware, navigateTo } from '#imports'
import { isEmbeddedPath } from '~/composables/embed'
import { isFirstVisit } from '~/composables/storage'

export default defineNuxtRouteMiddleware((to) => {
  // Embedded single-tab views (`/embed/*`) render their own content
  // chromelessly; skip the first-visit / overview redirects for them.
  if (isEmbeddedPath(to.path))
    return

  if (isFirstVisit.value) {
    if (to.path !== '/')
      return navigateTo('/')
  }
  else if (to.path === '/') {
    return navigateTo('/modules/overview')
  }
})
