import fs from 'node:fs';
import { fileURLToPath, URL } from 'node:url';

import uni from '@dcloudio/vite-plugin-uni';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    {
      name: 'local.config.ts',
      buildStart() {
        const path = 'src/local.config.ts';
        if (!fs.existsSync(path)) {
          fs.writeFileSync(path, '');
        }
      },
    },
    uni(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
});
