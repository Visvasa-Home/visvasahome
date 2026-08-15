import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

const figmaStubPlugin = {
  name: 'figma-stub',
  resolveId(id: string) {
    if (id.startsWith('figma:')) return '\0figma-stub:' + id
  },
  load(id: string) {
    if (id.startsWith('\0figma-stub:')) return 'export default undefined'
  },
}


function figmaAssetResolver() {
  return {
    name: 'figma-asset-resolver',
    resolveId(id: string) {
      if (id.startsWith('figma:asset/')) {
        const filename = id.replace('figma:asset/', '')
        return path.resolve(__dirname, 'src/assets', filename)
      }
    },
  }
}

export default defineConfig({
  plugins: [
    figmaAssetResolver(),
    react(),
    tailwindcss(),
    figmaStubPlugin,
  ],
  resolve: {
    alias: {
      // Root alias (backward compat)
      '@': path.resolve(__dirname, './src'),
      // Domain feature aliases
      '@auth':         path.resolve(__dirname, './src/features/auth'),
      '@booking':      path.resolve(__dirname, './src/features/booking'),
      '@catalog':      path.resolve(__dirname, './src/features/catalog'),
      '@payment':      path.resolve(__dirname, './src/features/payment'),
      '@admin':        path.resolve(__dirname, './src/features/admin'),
      '@professional': path.resolve(__dirname, './src/features/professional'),
      '@amc':          path.resolve(__dirname, './src/features/amc'),
      '@customer':     path.resolve(__dirname, './src/features/customer'),
      '@marketing':    path.resolve(__dirname, './src/features/marketing'),
      // Shared layers
      '@shared':       path.resolve(__dirname, './src/shared'),
      '@core':         path.resolve(__dirname, './src/core'),
      '@utils':        path.resolve(__dirname, './src/utils'),
      '@features':     path.resolve(__dirname, './src/features'),
    },
  },
  build: {
    // Code splitting for better performance
    rollupOptions: {
      output: {
        manualChunks: {
          // Core vendor libraries
          'vendor-react': ['react', 'react-dom'],
          // UI component libraries
          'vendor-ui': ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu', '@radix-ui/react-select', 'lucide-react'],
          // Animation libraries
          'vendor-motion': ['motion'],
          // Supabase client
          'vendor-supabase': ['@supabase/supabase-js'],
        },
      },
    },
    // Increase warning limit slightly (our app has many pages)
    chunkSizeWarningLimit: 600,
    // Enable source maps for error tracking (disable in prod if needed)
    sourcemap: false,
  },
})

