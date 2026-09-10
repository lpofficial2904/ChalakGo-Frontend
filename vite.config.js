import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath, URL } from 'node:url'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const apiTarget = env.VITE_DEV_API_PROXY || 'http://127.0.0.1:5000'
  return {
    plugins: [react(), tailwindcss()],
    server: {
      proxy: {
        '/api': { target: apiTarget, changeOrigin: true },
        '/uploads': { target: apiTarget, changeOrigin: true },
      },
    },
    resolve: {
      alias: [
        { find: /^react$/, replacement: fileURLToPath(new URL('./node_modules/react/index.js', import.meta.url)) },
        { find: /^react\/jsx-runtime$/, replacement: fileURLToPath(new URL('./node_modules/react/jsx-runtime.js', import.meta.url)) },
        { find: /^react-router-dom$/, replacement: fileURLToPath(new URL('./node_modules/react-router-dom/dist/index.js', import.meta.url)) },
      ],
    },
  }
})
