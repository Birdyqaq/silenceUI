import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import { resolve } from "path";
import commonjs from 'vite-plugin-commonjs';
export default defineConfig({
    build: {
        lib: {
            entry: resolve(__dirname, "src/index.ts"),
            name: "ExcelExportPlugin",
            fileName: (format) => `index.${format}.js`, // 根据格式生成文件名
            formats: ["es", "umd", "cjs"] // 输出格式：ES Module、UMD 和 CommonJS
        },
        rollupOptions: {
            external: ["xlsx"],
            output: {
                globals: {
                    xlsx: "XLSX"
                }
            }
        }
    },
    plugins: [dts(), commonjs()],
    optimizeDeps: {
        include: ['xlsx-style']
    }

});