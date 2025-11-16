import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'url'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/',
  plugins: [react()],
  server: {
    port: 3002,
    host: '0.0.0.0',
    strictPort: true,
    open: true,
    hmr: {
      host: 'localhost',
      port: 3002,
      protocol: 'ws',
      overlay: true
    },
    watch: {
      usePolling: true,
      interval: 100
    }
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  esbuild: {
    jsxDev: true,
    logOverride: { 'this-is-undefined-in-esm': 'silent' }
  },
  logLevel: 'info',
  build: {
    sourcemap: false,
    minify: 'esbuild',
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: fileURLToPath(new URL('./index.html', import.meta.url))
      }
    }
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'lucide-react'],
    force: true
  },
  clearScreen: false
})
