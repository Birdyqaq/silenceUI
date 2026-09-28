import { readdirSync } from 'node:fs';
import { resolve, relative, dirname, basename, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';

const packageRoot = dirname(fileURLToPath(import.meta.url));
const componentsRoot = resolve(packageRoot, 'components');

/** 递归收集每个组件的 index.ts，并以组件路径作为稳定入口名。 */
function collectComponentEntries(directory: string): Record<string, string> {
  return readdirSync(directory, { withFileTypes: true }).reduce<Record<string, string>>(
    (entries, item) => {
      const absolutePath = resolve(directory, item.name);
      if (item.isDirectory()) return { ...entries, ...collectComponentEntries(absolutePath) };
      if (item.isFile() && basename(absolutePath) === 'index.ts') {
        const entryName = relative(componentsRoot, dirname(absolutePath)).split(sep).join('/');
        entries[entryName] = absolutePath;
      }
      return entries;
    },
    {}
  );
}

const entries = {
  ...collectComponentEntries(componentsRoot),
  theme: resolve(packageRoot, 'utils/theme.ts'),
};

export default defineConfig({
  build: {
    outDir: 'dist/components',
    emptyOutDir: false,
    minify: 'terser',
    sourcemap: true,
    lib: {
      entry: entries,
      formats: ['es'],
    },
    rollupOptions: {
      external: (id) => id === 'lit' || id.startsWith('lit/'),
      output: {
        entryFileNames: '[name]/index.js',
        chunkFileNames: '_chunks/[name]-[hash].js',
        assetFileNames: '_assets/[name][extname]',
      },
    },
  },
});
