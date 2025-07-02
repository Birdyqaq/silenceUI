import { defineConfig } from "vite";
import { resolve } from "path";
import dts from 'vite-plugin-dts'
import UnocssVitePlugin from 'unocss/vite';
import path from 'path';
// import presetIcons from '@unocss/preset-icons';
// import { nodePolyfills } from 'vite-plugin-node-polyfills';
import stdLibBrowser from 'node-stdlib-browser';

export default defineConfig({
    resolve: {
        alias: {
            // 'node:v8': 'empty-module',
            // fs: 'vite-compatible-fs',
            // '@': path.resolve(__dirname, 'src'),
            // ...stdLibBrowser, // 使用 node-stdlib-browser 提供的 polyfill
        },
    },
    optimizeDeps: {
        exclude: [
            '@iconify/utils',
            'pkg-types',
            'mlly',
            'pathe',
            'local-pkg',
            'package-manager-detector'
        ],
    },
    build: {
        minify: 'terser',
        sourcemap: true,
        lib: {
            entry: resolve(__dirname, "index.ts"),
            name: "SilenceUi",
            fileName: "index",
            formats: ["es", "umd", "cjs"], // 打包生成的格式
        },
        rollupOptions: {
            external: [
                '@iconify/utils',
                'pkg-types',
                'mlly',
                'pathe',
                'local-pkg',
                'package-manager-detector'
            ],
            output: {
                globals: {
                    lit: 'lit'
                }
            }
        },
    },


    plugins: [
        dts(),
        UnocssVitePlugin({
            mode: 'shadow-dom'
        }), // 让其自动加载 uno.config.ts
    ]
});
