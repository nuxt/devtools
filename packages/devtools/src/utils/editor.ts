// Older DevTools versions stored `sublime` as the editor value, but the
// executable shipped with Sublime Text is `subl`. Keep the old value working
// for users who already have it persisted in their local settings.
const EDITOR_ALIASES: Record<string, string> = {
  sublime: 'subl',
}

/**
 * Resolve a configured editor value to the command passed to `launch-editor`.
 * Returns `undefined` to let `launch-editor` auto-detect the editor.
 */
export function resolveEditorCommand(editor: string | undefined): string | undefined {
  if (!editor || editor === 'auto')
    return undefined
  return EDITOR_ALIASES[editor] ?? editor
}
