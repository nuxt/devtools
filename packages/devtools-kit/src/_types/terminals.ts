import type { Options as ExecaOptions } from 'execa'

export interface TerminalBase {
  id: string
  name: string
  description?: string
  icon?: string
}

export type TerminalAction = 'restart' | 'terminate' | 'clear' | 'remove'

export interface SubprocessOptions extends ExecaOptions {
  command: string
  args?: string[]
}

export interface TerminalInfo extends TerminalBase {
  /**
   * Whether the terminal can be restarted
   */
  restartable?: boolean
  /**
   * Whether the terminal can be terminated
   */
  terminatable?: boolean

  /**
   * Whether the terminal is terminated
   */
  isTerminated?: boolean

  /**
   * Content buffer
   */
  buffer?: string
}

export interface TerminalState extends TerminalInfo {
  /**
   * User action to restart the terminal, when not provided, this action will be disabled
   */
  onActionRestart?: () => Promise<void> | void

  /**
   * User action to terminate the terminal, when not provided, this action will be disabled
   */
  onActionTerminate?: () => Promise<void> | void
}
