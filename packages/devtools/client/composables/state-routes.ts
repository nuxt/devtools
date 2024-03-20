// virtual-files Tab
export function useCurrentVirtualFile() {
  return useSessionState<string>('virtual-files:current', '')
}

// terminals Tab
export function useCurrentTerminalId() {
  return useSessionState<string>('terminals:current', '')
}

// server-routes Tab
export function useCurrentServeRoute() {
  return useSessionState<string>('server-routes:current', '')
}

export function useCurrentServerTask() {
  return useSessionState<string>('server-tasks:current', '')
}
