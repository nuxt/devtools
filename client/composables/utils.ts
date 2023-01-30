import { relative } from 'pathe'

export function isNodeModulePath(path: string) {
  return !!path.match(/[/\\]node_modules[/\\]/) || isPackageName(path)
}

export function isPackageName(name: string) {
  return name[0] === '#' || !!name.match(/^(@[a-z0-9-~][a-z0-9-._~]*\/)?[a-z0-9-~][a-z0-9-._~]*$/)
}

export function getModuleNameFromPath(path: string) {
  if (isPackageName(path))
    return path
  const match = path.replace(/\\/g, '/').match(/.*\/node_modules\/(.*)$/)?.[1]
  if (!match)
    return undefined
  if (match.startsWith('@'))
    return match.split('/').slice(0, 2).join('/')
  return match.split('/')[0]
}

export function getModuleSubpathFromPath(path: string) {
  if (isPackageName(path))
    return path
  const match = path.replace(/\\/g, '/').match(/.*\/node_modules\/(.*)$/)?.[1]
  if (!match)
    return undefined
  return match
}

export function isBuiltInModule(name: string | undefined) {
  if (!name)
    return
  return ['nuxt', '#app', '#head', 'vue'].includes(name)
}

export function getShortPath(path: string, root: string, subpath = false) {
  if (isNodeModulePath(path)) {
    return subpath
      ? getModuleSubpathFromPath(path)
      : getModuleNameFromPath(path)!
  }
  // Workaround https://github.com/unjs/pathe/issues/113
  try {
    let result = relative(root, path)
    if (!result.startsWith('./') && !result.startsWith('../'))
      result = `./${result}`
    if (result.startsWith('./.nuxt/'))
      result = `#build${result.slice(7)}`
    return result
  }
  catch {
    return path
  }
}

export function parseExpressRoute(route: string) {
  return route.split(/(:\w+)/).filter(Boolean)
}
