import { defineNuxtRouteMiddleware, navigateTo } from '#imports'
import { isEmbedded } from '~/composables/embed'
import { isFirstVisit } from '~/composables/storage'

export default defineNuxtRouteMiddleware((to) => {
  // Embedded anchor: skip the first-visit welcome; land on a real tab so the
  // frame-nav shim has something to report as the current view.
  if (isEmbedded.value) {
    if (to.path === '/')
      return navigateTo('/modules/overview')
    return
  }

  if (isFirstVisit.value) {
    if (to.path !== '/')
      return navigateTo('/')
  }
  else if (to.path === '/') {
    return navigateTo('/modules/overview')
  }
})
