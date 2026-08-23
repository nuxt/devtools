import type { SpawnOptions } from 'node:child_process'

export interface TerminalBase {
  id: string
  name: string
  description?: string
  icon?: string
}

export type TerminalAction = 'restart' | 'terminate' | 'clear' | 'remove'

export interface SubprocessOptions {
  command: string
  args?: string[]
  cwd?: string
  env?: Record<string, string | undefined>
  nodeOptions?: SpawnOptions
}

export interface TerminalInfo extends TerminalBase {
  /**
   * Whether the terminal can be restarted.
   *
   * @deprecated Ignored since v4: legacy terminals are bridged onto the built-in
   * Terminals dock as read-only, output-only sessions, so Devframe shows no
   * restart control. Restart a `startSubprocess()`-owned process through its
   * returned handle instead. Will be removed in v5.
   */
  restartable?: boolean
  /**
   * Whether the terminal can be terminated.
   *
   * @deprecated Ignored since v4 (see {@link TerminalInfo.restartable}). Will be
   * removed in v5.
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
   * User action to restart the terminal, when not provided, this action will be disabled.
   *
   * @deprecated Ignored since v4: the bridge to the built-in Terminals dock
   * cannot attach action callbacks to an externally registered session. Will be
   * removed in v5.
   */
  onActionRestart?: () => Promise<void> | void

  /**
   * User action to terminate the terminal, when not provided, this action will be disabled.
   *
   * @deprecated Ignored since v4 (see {@link TerminalState.onActionRestart}).
   * Will be removed in v5.
   */
  onActionTerminate?: () => Promise<void> | void
}
