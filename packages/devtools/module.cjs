/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable */
module.exports = function (...args) {
  const nuxt = this.nuxt || args[1]
  let _a
  let version = (nuxt == null ? void 0 : nuxt._version) || (nuxt == null ? void 0 : nuxt.version) || ((_a = nuxt == null ? void 0 : nuxt.constructor) == null ? void 0 : _a.version) || ''
  version = version.replace(/^v/g, '')
  // Nuxt DevTools is not compatible with Nuxt 2, disabled
  if (version.startsWith('2.')) {
    return
  }
  return import('./dist/module.mjs').then(m => m.default.call(this, ...args))
}
const _meta = module.exports.meta = require('./dist/module.json')
module.exports.getMeta = () => Promise.resolve(_meta)
