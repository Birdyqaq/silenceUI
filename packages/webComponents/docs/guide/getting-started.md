# 快速开始

## 安装

使用 npm 或 yarn 安装：

```bash
npm install webcomponents
# 或
yarn add webcomponents
# 或
pnpm add webcomponents
```

## 使用

### 全局引入

```javascript
// 引入所有组件
import 'webcomponents'

// 在 HTML 中使用
```

```html
<su-button type="primary">主要按钮</su-button>
<su-input placeholder="请输入内容"></su-input>
```

### 按需引入

```javascript
// 只引入需要的组件
import 'webcomponents/lib/button'
import 'webcomponents/lib/input'
```

### CDN 使用

```html
<script src="https://unpkg.com/webcomponents@latest/lib/index.js"></script>

<su-button type="primary">Hello World</su-button>
```

## 在不同框架中使用

### Vue 3

```vue
<template>
  <div>
    <su-button type="primary" @click="handleClick">
      点击我
    </su-button>
    <su-input v-model="inputValue" placeholder="请输入"></su-input>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import 'webcomponents'

const inputValue = ref('')

const handleClick = () => {
  console.log('按钮被点击了')
}
</script>
```

### React

```jsx
import React, { useRef, useEffect } from 'react'
import 'webcomponents'

function App() {
  const buttonRef = useRef(null)

  useEffect(() => {
    const button = buttonRef.current
    const handleClick = () => console.log('按钮被点击了')
    
    button?.addEventListener('click', handleClick)
    return () => button?.removeEventListener('click', handleClick)
  }, [])

  return (
    <div>
      <su-button ref={buttonRef} type="primary">
        点击我
      </su-button>
      <su-input placeholder="请输入"></su-input>
    </div>
  )
}
```

### Angular

```typescript
// app.component.ts
import { Component } from '@angular/core'
import 'webcomponents'

@Component({
  selector: 'app-root',
  template: `
    <su-button type="primary" (click)="handleClick()">
      点击我
    </su-button>
    <su-input placeholder="请输入"></su-input>
  `
})
export class AppComponent {
  handleClick() {
    console.log('按钮被点击了')
  }
}
```

## 下一步

- 查看 [组件文档](/components/) 了解所有可用组件
- 浏览 [API 参考](/api/) 获取详细的属性和方法说明
