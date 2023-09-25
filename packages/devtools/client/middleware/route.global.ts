import { isFirstVisit } from '~/composables/storage'
import { telemetryEnabled } from '~/composables/telemetry'

export default defineNuxtRouteMiddleware((to) => {
  if (to.path === '/' && !(isFirstVisit.value || telemetryEnabled.value == null))
    return navigateTo('/modules/overview')
  else if (to.path !== '/' && telemetryEnabled.value == null)
    return navigateTo('/')
})
