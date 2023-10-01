import { until } from '@vueuse/core'
import { UAParser } from 'ua-parser-js'

export const devAuthToken = ref<string | null>(localStorage.getItem('__nuxt_dev_token__'))

export const isDevAuthed = ref(false)

const bc = new BroadcastChannel('__nuxt_dev_token__')

bc.addEventListener('message', (e) => {
  if (e.data.event === 'new-token') {
    if (e.data.data === devAuthToken.value)
      return
    const token = e.data.data
    rpc.verifyAuthToken(token)
      .then((result) => {
        devAuthToken.value = result ? token : null
        isDevAuthed.value = result
      })
  }
})

export function updateDevAuthToken(token: string) {
  devAuthToken.value = token
  isDevAuthed.value = true
  localStorage.setItem('__nuxt_dev_token__', token)
  bc.postMessage({ event: 'new-token', data: token })
}

export async function ensureDevAuthToken() {
  if (isDevAuthed.value)
    return devAuthToken.value!

  if (!devAuthToken.value)
    await authConfirmAction()

  isDevAuthed.value = await rpc.verifyAuthToken(devAuthToken.value!)
  if (!isDevAuthed.value) {
    devAuthToken.value = null
    showNotification({
      message: 'Invalid auth token, action canceled',
      icon: 'i-carbon-warning-alt',
      classes: 'text-red',
    })
    await authConfirmAction()
    throw new Error('Invalid auth token')
  }

  return devAuthToken.value!
}

export const userAgentInfo = new UAParser(navigator.userAgent).getResult()

export async function requestForAuth() {
  const desc = [
    userAgentInfo.browser.name,
    userAgentInfo.browser.version,
    '|',
    userAgentInfo.os.name,
    userAgentInfo.os.version,
    userAgentInfo.device.type,
  ].filter(i => i).join(' ')
  return await rpc.requestForAuth(desc, window.location.origin)
}

async function authConfirmAction() {
  if (!devAuthToken.value)
    requestForAuth()

  const result = await Promise.race([
    AuthConfirm.start(),
    until(devAuthToken.value).toBeTruthy(),
  ])

  if (result === false) {
    // @unocss-include
    showNotification({
      message: 'Action canceled',
      icon: 'carbon-close',
      classes: 'text-orange',
    })
    throw new Error('User canceled auth')
  }
}
