import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import seoInjectPlugin from './vite-plugin-seo-inject.js';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    seoInjectPlugin(),
  ],
});
