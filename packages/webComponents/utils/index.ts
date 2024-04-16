import sass from 'sass';
import fs from 'fs';

// 读取 SCSS 文件内容
const scssContent = fs.readFileSync('./index.scss', 'utf-8');

// 编译 SCSS 内容为 CSS
sass.render({ data: scssContent }, (err, result) => {
    if (err) {
        console.error('Error compiling SCSS:', err);
    } else {
        // 创建 style 元素
        const style = document.createElement('style');
        // 将编译后的 CSS 内容写入到 style 元素的 textContent 中
        style.textContent = result.css.toString();
        // 将 style 元素添加到 shadowRoot 中
        shadowRoot.appendChild(style);
    }
});
