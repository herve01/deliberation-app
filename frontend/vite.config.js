import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import utils from './src/infrastructure/utils'
import path from 'path'

export default defineConfig({
  plugins: [react()],

  resolve: {
    alias: {
      '@src': path.resolve(__dirname, './src'),
    },
    extensions: ['.js', '.jsx'],
  },
  server: {
    proxy: {
      '/api': {
        target: utils.url, // backend
        changeOrigin: true,
      },
    },
  },
})