/** Mirrors unstorage's `StorageValue`, declared locally to avoid a dependency on either unstorage major. */
export type StorageValue = null | string | number | boolean | object

export type TabCategory
  = | 'pinned'
    | 'app'
    | 'analyze'
    | 'server'
    | 'modules'
    | 'documentation'
    | 'advanced'
