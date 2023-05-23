import type { ModuleStaticInfo } from '@nuxt/devtools-kit/types'

export interface DevToolsFrameState {
  width: number
  height: number
  bottom: number
  left: number
  open: boolean
  route: string
  position: 'left' | 'right' | 'bottom' | 'top'
  closeOnOutsideClick: boolean
}

export interface SocialPreviewResolved {
  url?: string
  title?: string
  description?: string
  favicon?: string
  image?: string
  imageAlt?: string
}

export interface SocialPreviewCard {
  url?: SocialPreviewCardItem[]
  title?: SocialPreviewCardItem[]
  description?: SocialPreviewCardItem[]
  favicon?: SocialPreviewCardItem[]
  image?: SocialPreviewCardItem[]
  imageAlt?: SocialPreviewCardItem[]
}

interface SocialPreviewCardItem {
  tag: string
  name?: string
}

export interface NormalizedHeadTag {
  tag: string
  name: string
  value: string
}

export interface InstallingModulestate {
  name: string
  info: ModuleStaticInfo
  processId: string
}

export interface AnalyzeBuildingState {
  name: string
  processId: string
}

export type ModuleActionType = 'install' | 'uninstall'
