import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path'; //needed for aliases

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      //Cleaner imports (matches my React component structure)
      '@': path.resolve(process.cwd(), './src'),
      '@components': path.resolve(process.cwd(), './src/components')
    }
  },
  server: {
    proxy: {
      //Proxy API calls to backend during development
      '/api': {
        target: 'http://localhost:5000', //my backend server
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '') //Remove /api prefix
      }
    }
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    minify: 'terser', //Optimize production build 
    sourcemap: true, //Helpful for debugging
    rollupOptions: {
      output: {
        manualChunks: {
          //Split vendor chunks for better caching
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'utils': ['axios', 'lodash']
        }
      }
    }
  }
}); 
