import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  base: '/racquet-sports-academy/',
  server: { port: 5173, open: true },
  assetsInclude: ['**/*.glb'],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        membership: resolve(__dirname, 'membership.html'),
        coaching: resolve(__dirname, 'coaching.html'),
        events: resolve(__dirname, 'events.html'),
        about: resolve(__dirname, 'about.html'),
        contact: resolve(__dirname, 'contact.html'),
      },
    },
  },
});
