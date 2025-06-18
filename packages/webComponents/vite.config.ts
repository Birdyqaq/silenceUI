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
        // exclude: ['package-manager-detector'],
        exclude: [
            '@iconify/utils',
            '@antfu/install-pkg',
            'package-manager-detector',
            'local-pkg'
        ],
    },
    build: {
        minify: 'terser',
        sourcemap: true,
        lib: {
            entry: resolve(__dirname, "index.ts"),  // 配置入口文件路径
            name: "SilenceUi",
            fileName: "index",
            formats: ["es", "umd", "cjs"], // 打包生成的格式
        },
        rollupOptions: {
            external: [
                'local-pkg',
                'package-manager-detector',
                'tinyexec',
                'existsSync',
                'package-manager-detector', // 将 lit 标记为外部依赖
                '@iconify/utils', // 避免打包 node 相关代码
                '@antfu/install-pkg',
            ],
            output: {
                globals: {
                    lit: 'lit' // 全局变量名称
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
// presetIcons({
//     mode: 'auto',
//     extraProperties: {
//         // 添加额外的 CSS 属性，以使所有图标默认为 inline-block
//         'display': 'inline-block',
//     },
// })
