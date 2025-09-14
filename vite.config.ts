import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
import { resolve } from 'path';
import history from 'connect-history-api-fallback';

export default defineConfig({
  base: '/Numinix/', // Set base for GitHub Pages deployment
  plugins: [
    react(),
    // Add more plugins if needed
  ],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    fs: {
      allow: ['.'],
    },
    middlewareMode: false,
    // Add SPA fallback middleware
    setupMiddlewares: (middlewares) => {
      middlewares.use(history());
      return middlewares;
    },
  },
  preview: {
    // This will fallback to index.html for all routes
    // when previewing the build locally
    fallback: true,
  },
});
