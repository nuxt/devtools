import type { RouteInfo } from '~~/../src/types'

export interface TreeNode {
  name?: string
  children: Record<string, TreeNode>
  items: RouteInfo[]
}

export function toTree(modules: RouteInfo[], name: string) {
  const node: TreeNode = { name, children: {}, items: [] }

  function add(mod: RouteInfo, parts: string[], current = node) {
    if (parts.length <= 1) {
      current.items.push(mod)
      return
    }

    const first = parts.shift()!
    if (!current.children[first])
      current.children[first] = { name: first, children: {}, items: [] }

    add(mod, parts, current.children[first])
  }

  modules
    .filter(i => i.file)
    .forEach((m) => {
      const parts = m.path.split(/\//g).filter(Boolean)
      add(m, parts)
    })

  return node
}
