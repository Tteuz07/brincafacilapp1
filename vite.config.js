import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  server: {
    port: 5177
  },
  plugins: [
    react()
    // VitePWA temporariamente desabilitado para deploy
  ],
  build: {
    target: 'esnext'
  }
})
