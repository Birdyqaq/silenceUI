import { defineConfig, presetUno, presetIcons } from 'unocss';

export default defineConfig({
    presets: [
        presetUno(),
        presetIcons()
    ],
    // 可根据需要添加自定义规则、主题等
});