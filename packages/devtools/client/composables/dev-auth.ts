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

  if (!devAuthToken.value) {
    const info = new UAParser(navigator.userAgent).getResult()
    const desc = [
      info.browser.name,
      info.browser.version,
      '|',
      info.os.name,
      info.os.version,
      info.device.type,
    ].filter(i => i).join(' ')
    rpc.requestForAuth(desc)

    const result = await Promise.race([
      AuthComfirm.start(),
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

  isDevAuthed.value = await rpc.verifyAuthToken(devAuthToken.value!)
  if (!isDevAuthed.value) {
    devAuthToken.value = null
    showNotification({
      message: 'Invalid auth token, action canceled',
      icon: 'i-carbon-warning-alt',
      classes: 'text-red',
    })
    throw new Error('Invalid auth token')
  }

  return devAuthToken.value!
}
