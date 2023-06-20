import { defineConfig } from 'tsup'

export default defineConfig({
  entry: [
    './src/*.ts',
  ],
  outDir: './extension/dist',
  format: ['iife'],
  outExtension() {
    return { js: '.js' }
  },
})
