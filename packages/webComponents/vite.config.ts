import { defineConfig } from 'vite';
import { resolve } from 'path';
import dts from 'vite-plugin-dts';
import UnocssVitePlugin from 'unocss/vite';

export default defineConfig({
  optimizeDeps: {
    exclude: [
      '@iconify/utils',
      'pkg-types',
      'mlly',
      'pathe',
      'local-pkg',
      'package-manager-detector',
    ],
  },
  build: {
    minify: 'terser',
    sourcemap: true,
    lib: {
      entry: resolve(__dirname, 'index.ts'),
      name: 'SilenceUi',
      fileName: 'index',
      formats: ['es', 'umd', 'cjs'], // 打包生成的格式
    },
    rollupOptions: {
      external: [
        '@iconify/utils',
        'pkg-types',
        'mlly',
        'pathe',
        'local-pkg',
        'package-manager-detector',
      ],
      output: {
        globals: {
          lit: 'lit',
        },
      },
    },
  },

  plugins: [
    dts({
      insertTypesEntry: true,
      exclude: ['**/*.test.ts', '**/*.stories.ts', 'docs/**'],
    }),
    UnocssVitePlugin({
      mode: 'shadow-dom',
    }), // 让其自动加载 uno.config.ts
  ],
});
