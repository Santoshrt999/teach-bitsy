import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// PWA support is added in Phase 5.
export default defineConfig({
  plugins: [react(), tailwindcss()],
  // The TensorFlow.js + MobileNet pipeline is intentionally lazy-loaded into its
  // own chunk, so the large-chunk warning for it is expected and not actionable.
  build: { chunkSizeWarningLimit: 2000 },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    css: true,
  },
});
