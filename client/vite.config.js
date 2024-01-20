import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  base: '',
  server: {
    port: 3000,
    proxy: {
      '/auth': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      },
      '/todo': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  plugins: [react()],
})
