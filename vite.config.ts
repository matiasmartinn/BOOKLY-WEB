import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'node:path';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // Tailwind v4 plugin
  ],
  resolve: {
    alias: {
      app: path.resolve(__dirname, 'src/app'),
      features: path.resolve(__dirname, 'src/features'),
      shared: path.resolve(__dirname, 'src/shared'),
      store: path.resolve(__dirname, 'src/store'),
    },
  },
  envPrefix: 'VITE_',
  server: {
    port: 5173,
    open: true,
  },
  preview: {
    port: 4173,
  },
  build: {
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom', 'react-router-dom'],
          mantine: [
            '@mantine/core',
            '@mantine/hooks',
            '@mantine/form',
            '@mantine/dates',
            '@mantine/notifications',
          ],
          charts: ['recharts'],
          query: ['@tanstack/react-query'],
          forms: ['react-hook-form', '@hookform/resolvers', 'zod'],
        },
      },
    },
  },
});
