import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  build: {
    chunkSizeWarningLimit: 700, // adjust based on your actual chunk sizes
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (!id.includes('node_modules')) return

          if (/node_modules\/(react|react-dom)\//.test(id)) return 'vendor-react'
          if (id.includes('react-router')) return 'vendor-react'
          if (id.includes('@tanstack/react-query')) return 'vendor-query'
          if (id.includes('lucide-react')) return 'vendor-icons'
          if (id.includes('sweetalert2')) return 'vendor-swal'
          if (id.includes('html5-qrcode')) return 'vendor-qr-scanner'
          if (id.includes('qrcode.react')) return 'vendor-qr-gen'

          // catch-all: everything else in node_modules goes into one shared chunk
          // instead of falling through to per-module chunks
          return 'vendor'
        },
      },
    },
  },
})
