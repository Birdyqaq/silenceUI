import { defineConfig } from "vite";
import { resolve } from "path";
import dts from 'vite-plugin-dts'
import UnoCss from "unocss/vite";
// import sass from 'sass';
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
    // css: {
    //     preprocessorOptions: {
    //         scss: {
    //             implementation: sass,
    //             additionalData: `@import "./styles/common.scss";`
    //         }
    //     },
    // },
    plugins: [dts(), UnoCss()]
});
