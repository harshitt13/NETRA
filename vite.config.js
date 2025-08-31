import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000, // We can specify a port for the dev server
    open: true, // Automatically open the app in the browser on server start
    proxy: {
      // Proxy API requests to the Flask backend during development
      '/api': {
        target: 'http://127.0.0.1:5000',
        changeOrigin: true,
      },
    },
  },
  define: {
    'process.env': process.env,
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
})
