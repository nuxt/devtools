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

export interface NormalizedHeadTag {
  tag: string
  name: string
  value: string
}
