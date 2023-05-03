export interface DevToolsFrameState {
  width: number
  height: number
  bottom: number
  left: number
  open: boolean
  route: string
  position: 'left' | 'right' | 'bottom' | 'top'
}

export interface DevToolsUISettings {
  componentsView: 'list' | 'graph'
  componentsGraphShowNodeModules: boolean
  componentsGraphShowPages: boolean
  componentsGraphShowLayouts: boolean
  componentsGraphShowWorkspace: boolean
  interactionCloseOnOutsideClick: boolean
  showExperimentalFeatures: boolean
  showHelpButtons: boolean
  scale: number
  hiddenTabs: string[]
  hiddenTabCategories: string[]
}

export interface SocialPreviewResolved {
  url?: string
  title?: string
  description?: string
  favicon?: string
  image?: string
  imageAlt?: string
}

export interface NormalizedHeadTag {
  tag: string
  name: string
  value: string
}
