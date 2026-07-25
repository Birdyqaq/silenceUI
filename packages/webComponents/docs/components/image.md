# Image 图片

增强版图片组件，支持懒加载、占位与全屏预览。

## 基础用法

<ClientOnly>
  <div style="display: flex; gap: 16px; flex-wrap: wrap; margin: 16px 0;">
    <se-image
      width="200"
      height="140"
      src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400"
      alt="Ocean">
    </se-image>
    <se-image
      width="200"
      height="140"
      src="https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=400"
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
    placeholder="https://dummyimage.com/240x160/eee/999&text=Loading..."
    errorPlaceholder="https://dummyimage.com/240x160/fed7e2/ff4d4f&text=Load+Failed"
    src="https://images.unsplash.com/photo-1521292270410-a8c2e5a52dff?w=800">
  </se-image>
</ClientOnly>

```html
<se-image
  width="240"
  height="160"
  lazy
  placeholder="占位图片地址"
  errorPlaceholder="加载失败占位"
  src="真正的图片地址">
</se-image>
```

## 预览与旋转

点击图片会自动打开内置预览层，并支持旋转。

<ClientOnly>
  <se-image
    width="240"
    height="160"
    src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=800">
  </se-image>
</ClientOnly>

## API

### 属性

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| src | 图片地址 | `string` | `''` |
| alt | 替代文本 | `string` | `''` |
| lazy | 是否懒加载 | `boolean` | `false` |
| placeholder | 懒加载占位图 | `string` | `''` |
| errorPlaceholder | 加载失败占位图 | `string` | `''` |
| width | 宽度（像素） | `number` | `100` |
| height | 高度（像素） | `number` | `100` |

### 事件

| 事件名 | 说明 |
| --- | --- |
| close | 关闭预览层时触发（由内部预览组件发出） |
