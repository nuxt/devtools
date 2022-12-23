import { relative } from 'pathe'

export function isNodeModulePath(path: string) {
  return path.match(/[/\\]node_modules[/\\]/) || isPackageName(path)
}

export function isPackageName(name: string) {
  return name[0] === '#' || name.match(/^(@[a-z0-9-~][a-z0-9-._~]*\/)?[a-z0-9-~][a-z0-9-._~]*$/)
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

export function isBuiltInModule(name: string | undefined) {
  if (!name)
    return
  return ['nuxt', '#app', '#head'].includes(name)
}

export function getShortPath(path: string, root: string) {
  if (isNodeModulePath(path))
    return getModuleNameFromPath(path)!
  const result = relative(root, path)
  if (result[0] !== '.')
    return `./${result}`
  return result
}
