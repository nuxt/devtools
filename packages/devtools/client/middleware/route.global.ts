import { defineNuxtRouteMiddleware, navigateTo } from '#imports'

export default defineNuxtRouteMiddleware((to) => {
  // The client is always the shared-frame anchor: land on a real tab so the
  // frame-nav shim has something to report as the current view.
  if (to.path === '/')
    return navigateTo('/modules/overview')
})
