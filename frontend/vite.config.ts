import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Separate vendor libraries
          vendor: ['react', 'react-dom', 'react-router-dom'],
          // Firebase
          firebase: ['firebase/app', 'firebase/auth', 'firebase/firestore', 'firebase/storage'],
          // Zustand
          state: ['zustand'],
          // Milkdown editor (largest dependency)
          editor: [
            '@milkdown/core',
            '@milkdown/ctx',
            '@milkdown/preset-commonmark',
            '@milkdown/preset-gfm',
            '@milkdown/plugin-slash',
            '@milkdown/plugin-block',
            '@milkdown/plugin-cursor',
            '@milkdown/plugin-listener',
            '@milkdown/plugin-history',
            '@milkdown/plugin-tooltip',
            '@milkdown/react'
          ],
          // UI libraries
          ui: ['lucide-react'],
          // CodeMirror (if used)
          codemirror: ['codemirror']
        }
      }
    },
    // Increase chunk size warning limit
    chunkSizeWarningLimit: 1000,
    // Enable source maps for better debugging but compress them
    sourcemap: false,
    // Use default minifier (esbuild) instead of terser for faster builds
    minify: 'esbuild'
  },
  // Optimize dependency pre-bundling
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'zustand',
      'firebase/app',
      'firebase/auth', 
      'firebase/firestore',
      'firebase/storage',
      'lucide-react'
    ],
    exclude: [
      // Exclude Milkdown from pre-bundling to allow for code splitting
      '@milkdown/core',
      '@milkdown/react'
    ]
  }
})
