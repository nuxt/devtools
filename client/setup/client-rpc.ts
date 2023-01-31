import type { ClientFunctions } from '../../src/types'

export function setupClientRPC() {
  const router = useRouter()
  const route = useRoute()

  const getVersionsData = useAsyncData('getVersions', () => rpc.getVersions())

  Object.assign(clientFunctions, {
    async refresh(type) {
      if (route.path.includes(type)) {
        router.replace({
          path: route.path,
          query: {
            t: Date.now(),
          },
        })
      }
      if (type === 'customTabs')
        await updateTabs()
      else if (type === 'versions')
        await getVersionsData.refresh()
    },
  } satisfies ClientFunctions)

  updateTabs()
}
