//uno.config.ts

import { defineConfig, presetUno } from "unocss";
export default defineConfig({
    presets: [
        presetUno(),
    ],
    //...Unocss的配置项 看下面配置介绍
    rules: [
        [/^m-([\.\d]+)$/, ([_, num]) => ({ margin: `${num}px` })],
        ['primary', { "background-color": "blue" }],
        ['secondary', { "background-color": "green" }],
        // 自定义 UnoCSS 规则
        // [/^bg-blue-500$/, ("background-color: blue !important;")],
        // 添加更多自定义规则...

    ],
});
