import { defineNuxtRouteMiddleware, navigateTo } from '#imports'
import { isEmbedded } from '~/composables/embed'
import { isFirstVisit } from '~/composables/storage'

export default defineNuxtRouteMiddleware((to) => {
  // Embedded single-tab mode (loaded inside a Vite DevTools dock iframe): the
  // iframe loads the client root with the target tab in `?to=`, and we
  // soft-navigate to it here — no deep server route is ever hard-loaded. Skip
  // the first-visit / overview redirects below so the embedded tab stays put.
  if (isEmbedded.value || to.query.embed === '1') {
    const target = to.query.to
    if (typeof target === 'string' && target && to.path !== target)
      return navigateTo({ path: target, query: { embed: '1' } })
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
