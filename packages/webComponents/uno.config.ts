//uno.config.ts

import { defineConfig, presetUno, presetIcons } from "unocss";
export default defineConfig({
    presets: [
        presetUno(),
        presetIcons({
            extraProperties: {
                "display": "inline-block",
                "vertical-align": "middle",
            },
        })
    ],
    theme: {
        colors: {
            error: 'red', // 主要颜色
            secondary: '#6c757d', // 次要颜色
            success: '#28a745', // 成功颜色
            danger: '#dc3545', // 危险颜色
            primary: "#cccccc",
            warning: '#ffc107', // 警告颜色
            info: '#17a2b8', // 信息颜色

        },
    },
    rules: [
        // [/^m-([\.\d]+)$/, ([_, num]) => ({ margin: `${num}px` })],
        // [/^p-([\.\d]+)$/, ([_, num]) => ({ padding: `${num}px` })],
        // ['primary', { "background-color": "blue", "color": "pink" }],
        // ['secondary', { "background-color": "green", "color": "green" }],
        // 自定义 UnoCSS 规则
        // [/^bg-blue-500$/, ("background-color: blue !important;")],
        // 添加更多自定义规则...

    ],
});
