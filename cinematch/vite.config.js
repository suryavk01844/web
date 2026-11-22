import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  // Relative paths so the built site works on GitHub Pages (username.github.io/<repo>/)
  base: './',
  plugins: [react()],
});
