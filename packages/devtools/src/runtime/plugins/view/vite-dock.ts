const NUXT_DOCK_ID = 'nuxt:devtools'
const VITE_DOCK_EMBEDDED_TAG = 'vite-devtools-dock-embedded'

export interface ViteDockHost {
  selected?: { id?: string | null } | null
  selectedId?: string | null
  switchEntry: (id?: string | null) => Promise<boolean> | boolean
  toggleEntry: (id: string) => Promise<boolean> | boolean
}

export function getViteDocksContext() {
  const dock = document.querySelector<HTMLElement & { context?: { docks?: ViteDockHost } }>(VITE_DOCK_EMBEDDED_TAG)
  const docks = dock?.context?.docks
  if (!docks)
    return undefined
  if (typeof docks.switchEntry !== 'function' || typeof docks.toggleEntry !== 'function')
    return undefined
  return docks
}

export async function waitForViteDocksContext(retry = 40, timeout = 50): Promise<ViteDockHost | undefined> {
  while (retry-- > 0) {
    const docks = getViteDocksContext()
    if (docks)
      return docks
    await new Promise(resolve => setTimeout(resolve, timeout))
  }
  return undefined
}

export function isNuxtDockSelected(docks: ViteDockHost | undefined) {
  if (!docks)
    return false
  return docks.selected?.id === NUXT_DOCK_ID || docks.selectedId === NUXT_DOCK_ID
}

export async function openNuxtDock(docks: ViteDockHost) {
  await docks.switchEntry(NUXT_DOCK_ID)
}

export async function closeNuxtDock(docks: ViteDockHost) {
  if (!isNuxtDockSelected(docks))
    return
  await docks.switchEntry(null)
}

export async function toggleNuxtDock(docks: ViteDockHost) {
  await docks.toggleEntry(NUXT_DOCK_ID)
}

export function findNuxtDockIframe() {
  const dock = document.querySelector<HTMLElement>(VITE_DOCK_EMBEDDED_TAG)
  const root = dock?.shadowRoot
  if (!root)
    return undefined
  return [...root.querySelectorAll('iframe')]
    .find(iframe => iframe.src.includes('/__nuxt_devtools__/client'))
}
