import { defineConfig } from 'vite';

// Independent source fixture: no docs server, CDN, backend or production site required.
export default defineConfig({
  server: { host: '127.0.0.1', port: 4179, strictPort: true },
});
