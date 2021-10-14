import { defineConfig } from 'vite'
import imagePlugin from '../../../src/plugins/image'

export default defineConfig({
  plugins: [imagePlugin()],
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
