// Helper for `PW_PROJECT` glob filtering — used by playwright.config.ts to
// filter projects + webServer entries down to the active selection.

const REGEX_META = /[.+?^${}()|[\]\\]/g

export function globToRegExp(glob: string): RegExp {
  const escaped = glob.replace(REGEX_META, '\\$&').replace(/\*/g, '.*')
  return new RegExp(`^${escaped}$`)
}

export function matchesProjectFilter(name: string, filter: string | undefined): boolean {
  if (!filter)
    return true
  return globToRegExp(filter).test(name)
}
