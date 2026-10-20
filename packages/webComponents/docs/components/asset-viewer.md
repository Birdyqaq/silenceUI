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

未手动指定 `type` 时会根据 URL pathname 的文件后缀推断，忽略查询参数和片段（例如 `/guide.pdf?token=abc#page=2` 仍识别为 PDF）：

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

没有文件后缀的下载接口需显式传入 `type`，不会从查询参数里的文件名猜测类型。图片、视频和音频触发加载失败时显示重试提示；PDF 嵌入页的 HTTP 错误或跨域内容不能可靠检测，需由业务层保证资源可用。

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

预览缩略图是可键盘聚焦的按钮，Enter/Space 可打开；预览层支持 Escape、Tab 焦点循环及关闭后焦点恢复。打开时锁定页面滚动，关闭或卸载时释放；切换 src/type 会关闭旧预览。图片、视频和音频可在加载失败后点击重试。PDF iframe 内部的键盘事件由嵌入页面控制，不保证能传出至外层。
