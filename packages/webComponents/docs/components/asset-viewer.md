<script setup>
import { withBase } from 'vitepress';
</script>

# AssetViewer 资源预览

用于预览文件或多媒体资源，支持图片、视频、音频、PDF 以及自定义下载。

## 基础用法

<ClientOnly>
  <se-asset-viewer
    title="风景照片"
    :src="withBase('/demo/landscape.svg')">
  </se-asset-viewer>
</ClientOnly>

```html
<se-asset-viewer title="风景照片" src="/demo/landscape.svg"> </se-asset-viewer>
```

## 自动识别类型

未手动指定 `type` 时会根据文件后缀推断：

- 图片：png/jpg/jpeg/gif/webp/svg
- 视频：mp4/webm/mov
- 音频：mp3/wav/ogg
- PDF：以 `.pdf` 结尾

图片预览使用本地 SVG 资源，可直接点击上面的卡片验证。音视频与 PDF 的接入格式如下（请替换为应用自己的可访问资源）：

```html
<se-asset-viewer title="项目文档" type="pdf" src="/files/guide.pdf"></se-asset-viewer>
<se-asset-viewer title="宣传视频" type="video" src="/files/demo.mp4"></se-asset-viewer>
<se-asset-viewer title="提示音" type="audio" src="/files/demo.wav"></se-asset-viewer>
```

媒体编码、CORS 与浏览器 PDF 支持取决于资源和目标环境，这些 URL 是格式示例，不会在文档页面自动请求。

## 自定义缩略图与禁用下载

<ClientOnly>
  <se-asset-viewer
    title="自定义封面"
    :src="withBase('/demo/landscape.svg')"
    :thumbnail="withBase('/demo/placeholder.svg')"
    :downloadable.prop="false"
    id="asset-custom-thumb">
  </se-asset-viewer>
</ClientOnly>

```html
<se-asset-viewer
  title="自定义封面"
  src="https://.../original.png"
  thumbnail="https://.../thumb.png"
  id="asset-custom-thumb"
>
</se-asset-viewer>

<script type="module">
  document.querySelector('#asset-custom-thumb').downloadable = false;
</script>
```

## API

### 属性

| 属性           | 说明                                            | 类型                                                  | 默认值    |
| -------------- | ----------------------------------------------- | ----------------------------------------------------- | --------- |
| `src`          | 资源地址                                        | `string`                                              | `''`      |
| `thumbnail`    | 缩略图地址，仅图片类型优先使用                  | `string`                                              | `''`      |
| `title`        | 标题；为空时显示 `src`                          | `string`                                              | `''`      |
| `downloadable` | 是否显示下载链接，false 需通过 JS property 设置 | `boolean`                                             | `true`    |
| `type`         | 资源类型；`unknown` 时按后缀推断                | `'image' \| 'video' \| 'audio' \| 'pdf' \| 'unknown'` | `unknown` |

### 事件

| 事件名     | 说明           | 回调参数                                                                     |
| ---------- | -------------- | ---------------------------------------------------------------------------- |
| asset-open | 开启预览时触发 | `{ src: string, type: 'image' \| 'video' \| 'audio' \| 'pdf' \| 'unknown' }` |

> 预览层点击空白区域或“关闭”按钮即可退出。
