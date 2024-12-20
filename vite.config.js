import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import mkcert from'vite-plugin-mkcert';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    https: true,
  },
  plugins: [
    vue(),
    mkcert({
      force: true,
      autoUpgrade: true,
    }),
    nodePolyfills(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
