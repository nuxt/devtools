import { until } from '@vueuse/core'
import { UAParser } from 'ua-parser-js'

export const devAuthToken = ref<string | null>(localStorage.getItem('__nuxt_dev_token__'))

const isAuthed = ref(false)

const bc = new BroadcastChannel('__nuxt_dev_token__')

bc.addEventListener('message', (e) => {
  if (e.data.event === 'new-token') {
    const token = e.data.data
    rpc.verifyAuthToken(token)
      .then((result) => {
        devAuthToken.value = result ? token : null
        isAuthed.value = result
      })
  }
})

export async function ensureDevAuthToken() {
  if (isAuthed.value)
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

  isAuthed.value = await rpc.verifyAuthToken(devAuthToken.value!)
  if (!isAuthed.value) {
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
