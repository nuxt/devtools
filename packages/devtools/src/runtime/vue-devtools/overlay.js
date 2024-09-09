import { functions } from '@vue/devtools-core'
import { createRpcServer, devtools } from '@vue/devtools-kit'

devtools.init()

createRpcServer(functions, {
  preset: 'iframe',
})
