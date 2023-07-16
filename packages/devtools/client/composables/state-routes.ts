// server-routes Tab
export function useServerRoutesState() {
  return useState<string>('server-routes:state')
}

// analyze-build Tab
export function useAnalyzeBuildState() {
  return useState<string>('analyze-build:state')
}

// virtual-files Tab
export function useVirtualFileState() {
  return useState<string>('virtual-files:state')
}

// storage Tab
export function useStorageState() {
  return useState<string>('storage:state')
}

export function useStorageFileState() {
  return useState<string>('storage:file:state')
}

// terminals Tab
export function useTerminalState() {
  return useState<string>('terminals:state')
}
