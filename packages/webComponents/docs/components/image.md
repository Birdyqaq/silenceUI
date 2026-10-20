<script setup>
import { withBase } from 'vitepress';
</script>

# Image 图片

增强版图片组件，支持懒加载、占位与全屏预览。

## 基础用法

<ClientOnly>
  <div style="display: flex; gap: 16px; flex-wrap: wrap; margin: 16px 0;">
    <se-image
      width="200"
      height="140"
      :src="withBase('/demo/landscape.svg')"
      alt="Ocean">
    </se-image>
    <se-image
      width="200"
      height="140"
      :src="withBase('/demo/landscape.svg')"
      alt="Mountain">
    </se-image>
  </div>
</ClientOnly>

```html
<se-image width="200" height="140" src="https://.../ocean.jpg" alt="Ocean"></se-image>
```

## 懒加载与占位

<ClientOnly>
  <se-image
    width="240"
    height="160"
    lazy
    :placeholder="withBase('/demo/placeholder.svg')"
    :errorPlaceholder="withBase('/demo/placeholder.svg')"
    :src="withBase('/demo/landscape.svg')">
  </se-image>
</ClientOnly>

```html
<se-image
  width="240"
  height="160"
  lazy
  placeholder="占位图片地址"
  errorPlaceholder="加载失败占位"
  src="真正的图片地址"
>
</se-image>
```

## 预览与旋转

点击图片会自动打开内置预览层，并支持旋转。预览层支持 Escape、遮罩点击、焦点循环和关闭后焦点恢复。

<ClientOnly>
  <se-image
    width="240"
    height="160"
    :src="withBase('/demo/landscape.svg')">
  </se-image>
</ClientOnly>

## API

### 属性

| 属性               | 说明                             | 类型                                             | 默认值  |
| ------------------ | -------------------------------- | ------------------------------------------------ | ------- |
| `src`              | 图片地址                         | `string`                                         | `''`    |
| `alt`              | 替代文本及预览按钮无障碍名称     | `string`                                         | `''`    |
| `lazy`             | 使用浏览器原生懒加载             | `boolean`                                        | `false` |
| `placeholder`      | 真实图片加载完成前显示的占位图   | `string`                                         | `''`    |
| `errorPlaceholder` | 真实图片加载失败后使用的回退图片 | `string`                                         | `''`    |
| `width`            | 宽度（像素）                     | `number`                                         | `100`   |
| `height`           | 高度（像素）                     | `number`                                         | `100`   |
| `fit`              | 图片填充方式                     | `contain \| cover \| fill \| none \| scale-down` | `cover` |
| `preview`          | 点击时是否打开预览               | `boolean`                                        | `true`  |

### 事件

`placeholder` 只承担视觉占位；浏览器会同时请求 `src`，真实图片加载完成后以淡入方式替换占位图。
