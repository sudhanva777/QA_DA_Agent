import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            if (id.includes('three') || id.includes('@react-three')) {
              return 'vendor-three';
            }
            if (id.includes('recharts')) {
              return 'vendor-recharts';
            }
            if (id.includes('react-router')) {
              return 'vendor-router';
            }
            if (id.includes('axios') || id.includes('lucide-react') || id.includes('react-hot-toast')) {
              return 'vendor-utils';
            }
            return 'vendor';
          }
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
})
