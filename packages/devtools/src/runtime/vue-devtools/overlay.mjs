import { createRpcServer, devtools } from '@vue/devtools-kit'
import { functions } from '@vue/devtools-core'

devtools.init()

createRpcServer(functions, {
  preset: 'iframe',
})
