import type { VNode } from 'vue'

export interface ModuleCustomTab {
  /**
   * The name of the tab, must be unique
   */
  name: string
  /**
   * Icon of the tab, support any Iconify icons, or a url to an image
   */
  icon?: string
  /**
   * Title of the tab
   */
  title: string
  /**
   * Main view of the tab
   */
  view: ModuleView
  /**
   * Insert static vnode to the tab entry
   *
   * Advanced options. You don't usually need this.
   */
  extraTabVNode?: VNode
}

export interface ModuleLaunchView {
  /**
   * A view for module to lazy launch some actions
   */
  type: 'launch'
  title?: string
  icon?: string
  description: string
  /**
   * Action buttons
   */
  actions: ModuleLaunchAction[]
}

export interface ModuleIframeView {
  /**
   * Iframe view
   */
  type: 'iframe'
  /**
   * Url of the iframe
   */
  src: string
  /**
   * Persist the iframe instance even if the tab is not active
   *
   * @default true
   */
  persistent?: boolean
}

export interface ModuleVNodeView {
  /**
   * Vue's VNode view
   */
  type: 'vnode'
  /**
   * Send vnode to the client, they must be static and serializable
   *
   * Call `nuxt.hook('devtools:customTabs:refresh')` to trigger manual refresh
   */
  vnode: VNode
}

export interface ModuleLaunchAction {
  /**
   * Label of the action button
   */
  label: string
  /**
   * Additional HTML attributes to the action button
   */
  attrs?: Record<string, string>
  /**
   * Indicate if the action is pending, will show a loading indicator and disable the button
   */
  pending?: boolean
  /**
   * Function to handle the action, this is executed on the server side.
   * Will automatically refresh the tabs after the action is resolved.
   */
  handle?: () => void | Promise<void>
  /**
   * Treat the action as a link, will open the link in a new tab
   */
  src?: string
}

export type ModuleView = ModuleIframeView | ModuleLaunchView | ModuleVNodeView

export interface ModuleIframeTabLazyOptions {
  description?: string
  onLoad?: () => Promise<void>
}

export interface ModuleBuiltinTab {
  name: string
  icon?: string
  title?: string
  path?: string
  requireClient?: boolean
  shouldShow?: () => boolean
}

export type ModuleTabInfo = ModuleCustomTab | ModuleBuiltinTab
