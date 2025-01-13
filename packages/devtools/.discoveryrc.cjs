const { join } = require('node:path')

module.exports = {
  name: 'Nuxt Server Data',
  basedir: join(__dirname, 'discovery'),
  embed: true,
  // view: {
  //   assets: [
  //     './pages/common.css',
  //     './pages/default.js',
  //   ],
  // },
}
