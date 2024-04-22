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
            // 其他预设配置...
            presetIcons({
                mode: 'auto',
                extraProperties: {
                    // 添加额外的 CSS 属性，以使所有图标默认为 inline-block
                    'display': 'inline-block',
                },
            })
        ],
    }),
    ]
});
