# AssetViewer 资源预览

用于预览文件或多媒体资源，支持图片、视频、音频、PDF 以及自定义下载。

## 基础用法

<ClientOnly>
  <se-asset-viewer
    title="风景照片"
    src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=800">
  </se-asset-viewer>
</ClientOnly>

```html
<se-asset-viewer
  title="风景照片"
  src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=800">
</se-asset-viewer>
```

## 自动识别类型

未手动指定 `type` 时会根据文件后缀推断：

- 图片：png/jpg/jpeg/gif/webp/svg
- 视频：mp4/webm/mov
- 音频：mp3/wav/ogg
- PDF：以 `.pdf` 结尾

<ClientOnly>
  <div style="display: grid; gap: 12px; margin: 16px 0;">
    <se-asset-viewer
      title="项目文档"
      src="https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf">
    </se-asset-viewer>
    <se-asset-viewer
      title="宣传视频"
      src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4">
    </se-asset-viewer>
  </div>
</ClientOnly>

## 自定义缩略图与禁用下载

<ClientOnly>
  <se-asset-viewer
    title="自定义封面"
    src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1200"
    thumbnail="https://dummyimage.com/120x90/0ea5e9/fff&text=Thumb"
    id="asset-custom-thumb">
  </se-asset-viewer>
</ClientOnly>

```html
<se-asset-viewer
  title="自定义封面"
  src="https://.../original.png"
  thumbnail="https://.../thumb.png"
  id="asset-custom-thumb">
</se-asset-viewer>

<script type="module">
  document.querySelector('#asset-custom-thumb').downloadable = false
</script>
```

## 事件

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| asset-open | 开启预览时触发 | `{ src: string, type: 'image' \| 'video' \| 'audio' \| 'pdf' \| 'unknown' }` |

> 预览层点击空白区域或“关闭”按钮即可退出。

<script setup>
import { onMounted } from 'vue'

onMounted(() => {
  const asset = document.querySelector('#asset-custom-thumb')
  if (asset) {
    asset.downloadable = false
  }
})
</script>
