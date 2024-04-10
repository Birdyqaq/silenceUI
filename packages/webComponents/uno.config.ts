//uno.config.ts

import { defineConfig } from "unocss";

export default defineConfig({
    //...Unocss的配置项 看下面配置介绍
    rules: [
        [/^m-([\.\d]+)$/, ([_, num]) => ({ margin: `${num}px` })],
    ],
});
