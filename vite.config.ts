import react from '@vitejs/plugin-react-swc';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import svgr from 'vite-plugin-svgr';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const customAliasPaths = [
  'components',
  'context',
  'renderer',
  'store',
  'utils',
];

// https://vite.dev/config/
export default defineConfig({
  base: '/matrix-constructor/',
  plugins: [react(), svgr({ include: '**/*.svg' })],
  resolve: {
    alias: {
      ...Object.fromEntries(customAliasPaths.map((item) => ([
        item, path.resolve(__dirname, `./src/${item}`),
      ]))),
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
