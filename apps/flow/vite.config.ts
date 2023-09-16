import { join } from 'path';
import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';
// import devtools from 'solid-devtools/vite';

export default defineConfig({
  plugins: [
    /* 
    Uncomment the following line to enable solid-devtools.
    For more info see https://github.com/thetarnav/solid-devtools/tree/main/packages/extension#readme
    */
    // devtools(),
    solidPlugin(),
  ],
  server: {
    port: 3000,
  },
  build: {
    target: 'esnext',
  },
  resolve: {
    alias: {
      '_@components': join(__dirname, './src/components'),
      '_@models': join(__dirname, './src/models'),
      '_@primitives': join(__dirname, './src/primitives'),
      '_@pages': join(__dirname, './src/pages'),
    },
  },
});
