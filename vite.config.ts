import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

const dir = import.meta.dirname;

export default defineConfig({
  plugins: [react()],
  resolve: {
    tsconfigPaths: true,
    alias: {
      '@':           path.resolve(dir, './src'),
      '@/app':       path.resolve(dir, './src/app'),
      '@/assets':    path.resolve(dir, './src/assets'),
      '@/config':    path.resolve(dir, './src/config'),
      '@/contexts':  path.resolve(dir, './src/contexts'),
      '@/features':  path.resolve(dir, './src/features'),
      '@/layouts':   path.resolve(dir, './src/layouts'),
      '@/lib':       path.resolve(dir, './src/lib'),
      '@/providers': path.resolve(dir, './src/providers'),
      '@/routes':    path.resolve(dir, './src/routes'),
      '@/services':  path.resolve(dir, './src/services'),
      '@/shared':    path.resolve(dir, './src/shared'),
      '@/store':     path.resolve(dir, './src/store'),
      '@/styles':    path.resolve(dir, './src/styles'),
      '@/types':     path.resolve(dir, './src/types'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) {
              return 'react-vendor';
            }
            if (id.includes('@tanstack')) {
              return 'query-vendor';
            }
            if (id.includes('recharts') || id.includes('framer-motion')) {
              return 'ui-vendor';
            }
            if (id.includes('lucide-react')) {
              return 'icons-vendor';
            }
          }
        },
      },
    },
    chunkSizeWarningLimit: 600,
  },
  server: {
    port: 3000,
    open: false,
  },
});
