import { defineConfig } from "vite";
import { resolve } from "path";
import dts from 'vite-plugin-dts'
import UnoCss from "unocss/vite";
import presetIcons from '@unocss/preset-icons';
export default defineConfig({
    build: {
        minify: 'terser',
        sourcemap: true,
        lib: {
            entry: resolve(__dirname, "index.ts"),  // 配置入口文件路径
            name: "silenceUi",
            fileName: "index",
            formats: ["es", "umd"], // 打包生成的格式
        },
    },

    plugins: [dts(),
    UnoCss({
        mode: 'shadow-dom',
        presets: [
            presetIcons({
                scale: 1.5,
                prefix: 'icon-',
                collections: {
                    quill: () => import('@iconify-json/quill').then(i => i.default), // 这里保持动态导入
                },
            })
            // 其他预设配置...
        ],
    }),
    ]
});
