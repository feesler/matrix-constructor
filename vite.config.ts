import react from '@vitejs/plugin-react-swc';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import svgr from 'vite-plugin-svgr';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), svgr({ include: '**/*.svg' })],
  resolve: {
    alias: {
      "components": path.resolve(__dirname, "./src/components"),
      "context": path.resolve(__dirname, "./src/context"),
      "renderer": path.resolve(__dirname, "./src/renderer"),
      "store": path.resolve(__dirname, "./src/store"),
      "utils": path.resolve(__dirname, "./src/utils"),
    },
  },
  optimizeDeps: {
    include: ['react-dom', 'classnames'],
  },
  build: {
    commonjsOptions: {
      include: [/node_modules/],
    },
  },
});
