export interface TerminalBase {
  id: string
  name: string
  description?: string
  icon?: string
}

export type TerminalAction = 'restart' | 'terminate' | 'clear'

export interface TerminalInfo extends TerminalBase {
  restartable?: boolean
  terminatable?: boolean
  buffer?: string
}

export interface TerminalState extends TerminalBase {
  /**
   * User action to restart the terminal, when not provided, this action will be disabled
   */
  onActionRestart?: () => Promise<void> | void

  /**
   * User action to terminate the terminal, when not provided, this action will be disabled
   */
  onActionTerminate?: () => Promise<void> | void

  /**
   * Content buffer
   */
  buffer?: string
}
