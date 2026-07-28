# 快速开始

## 安装

```bash
npm install webcomponents
# 或
yarn add webcomponents
# 或
pnpm add webcomponents
```

## 注册组件

在应用入口引入样式并注册全部组件：

```ts
import 'webcomponents/style.css';
import 'webcomponents';
```

```html
<su-button type="primary">保存</su-button> <su-input placeholder="请输入关键词"></su-input>
```

当前包入口是整包注册模式，会自动恢复本地持久化的主题配置。组件级按需入口尚未发布，不要使用 `webcomponents/lib/button` 这类路径。

## 基础页面

```html
<su-container siderWidth="220px" headerHeight="56px">
  <su-menu slot="sider" id="menu"></su-menu>
  <div slot="header">
    管理后台
    <su-theme-toggle></su-theme-toggle>
  </div>

  <su-card>
    <span slot="header">查询条件</span>
    <su-form-item label="关键词">
      <su-input id="keyword" clearable placeholder="订单号 / 用户名"></su-input>
    </su-form-item>
  </su-card>
</su-container>

<script type="module">
  import 'webcomponents/style.css';
  import 'webcomponents';

  const menu = document.querySelector('#menu');
  menu.items = [
    { key: 'dashboard', label: '工作台' },
    { key: 'orders', label: '订单管理' },
  ];

  document.querySelector('#keyword').addEventListener('input-change', (event) => {
    console.log(event.detail.value);
  });
</script>
```

## 复杂数据

数组、对象、函数通过 DOM property 赋值：

```ts
const table = document.querySelector('se-table');
table.columns = [
  { key: 'name', label: '姓名', sortable: true },
  { key: 'age', label: '年龄', align: 'right' },
];
table.data = [
  { id: 1, name: 'Alice', age: 24 },
  { id: 2, name: 'Bob', age: 28 },
];
```

只写 HTML 时，可用 `itemsJson` 或 `optionsJson` 传 JSON 字符串：

```html
<su-select value="sh" optionsJson='[{"label":"上海","value":"sh"},{"label":"北京","value":"bj"}]'>
</su-select>
```

## Vue 3

在 Vite 中声明 `su-` / `se-` 为原生自定义元素：

```ts
import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          isCustomElement: (tag) => tag.startsWith('su-') || tag.startsWith('se-'),
        },
      },
    }),
  ],
});
```

```vue
<script setup lang="ts">
import 'webcomponents/style.css';
import 'webcomponents';

const handleInput = (event: CustomEvent<{ value: string }>) => {
  console.log(event.detail.value);
};
</script>

<template>
  <su-button type="primary">保存</su-button>
  <su-input placeholder="请输入" @input-change="handleInput"></su-input>
</template>
```

## React

React 19 之前，复杂属性建议通过 ref 赋值，自定义事件建议用 `addEventListener`：

```tsx
import { useEffect, useRef } from 'react';
import 'webcomponents/style.css';
import 'webcomponents';

export function DemoTable({ rows }) {
  const tableRef = useRef(null);

  useEffect(() => {
    const table = tableRef.current;
    if (!table) return;

    table.columns = [
      { key: 'name', label: '姓名' },
      { key: 'age', label: '年龄', align: 'right' },
    ];
    table.data = rows;

    const onRowClick = (event) => console.log(event.detail.row);
    table.addEventListener('row-click', onRowClick);
    return () => table.removeEventListener('row-click', onRowClick);
  }, [rows]);

  return <se-table ref={tableRef} pagination={false}></se-table>;
}
```

TypeScript 项目可按需补充 JSX 标签声明：

```ts
declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'su-button': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
      'su-input': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
      'se-table': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
    }
  }
}
```

## Angular

在模块或 standalone 组件配置中允许 Custom Elements：

```ts
import { CUSTOM_ELEMENTS_SCHEMA, Component } from '@angular/core';
import 'webcomponents/style.css';
import 'webcomponents';

@Component({
  selector: 'app-root',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <su-button type="primary">保存</su-button>
    <su-input placeholder="请输入"></su-input>
  `,
})
export class AppComponent {}
```

## 下一步

- 查看 [API 约定](/guide/api-conventions) 了解属性、事件和框架适配规则。
- 查看 [组件总览](/components/) 选择具体组件。
- 查看 [主题定制](/guide/theme) 配置明暗模式与品牌色。
