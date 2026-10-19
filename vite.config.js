import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { readFileSync } from 'node:fs';

// Shown on the home card: the version from package.json and the day of the build,
// so a visitor can tell how fresh the site is
const { version } = JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf8'));

// The site is served at the root of sylvainlano.github.io
export default defineConfig({
  plugins: [react()],
  define: {
    __APP_VERSION__: JSON.stringify(version),
    __BUILD_DATE__: JSON.stringify(new Date().toISOString()),
  },
  base: '/',
  server: { port: 3000, open: true },
  build: {
    outDir: 'dist',
    // three.js's WebGL renderer alone weighs ~600 kB minified (~170 kB gzipped);
    // that is expected, not a sign of a problem in our code.
    chunkSizeWarningLimit: 700,
  },
});
