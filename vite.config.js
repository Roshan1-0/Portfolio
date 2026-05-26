import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  
  resolve: {
    alias: {
      '@': '/src',
    },
  },

  assetsInclude: ['**/*.glsl', '**/*.vert', '**/*.frag'],

  build: {
    sourcemap: true,

    rollupOptions: {
      output: {
        manualChunks(id) {
          // Animation libraries
          if (
            id.includes('gsap') ||
            id.includes('framer-motion') ||
            id.includes('lenis')
          ) {
            return 'animation';
          }

          // React libraries
          if (
            id.includes('react') ||
            id.includes('react-dom')
          ) {
            return 'vendor';
          }

          // Other node_modules
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        },
      },
    },
  },
});