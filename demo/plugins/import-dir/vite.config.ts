import { defineConfig } from 'vite'
import importDirPlugin from '../../../src/plugins/import-dir'

export default defineConfig({
  plugins: [importDirPlugin()],
  root: __dirname,
  build: {
    assetsInlineLimit: 0,
    minify: false,
    lib: {
      formats: ['es'],
      name: 'demo',
      entry: 'index.ts',
    },
  },
})
