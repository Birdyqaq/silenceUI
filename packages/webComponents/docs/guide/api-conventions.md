# API 约定

这页记录 SilenceUI 组件的通用接入规则。查具体参数时看组件文档；遇到框架适配问题时，先按这里的约定排查。

应用入口建议先引入主题样式，再注册组件：

```ts
import 'webcomponents/style.css';
import 'webcomponents';
```

## 标签前缀

新组件统一使用 `su-` 前缀，例如 `su-button`、`su-modal`、`su-tabs`。

以下组件保留历史 `se-` 前缀：`se-table`、`se-pagination`、`se-image`、`se-asset-viewer`。它们仍从包入口自动注册。

## 属性传递

简单值可以直接写成 attribute：

```html
<su-button type="primary" loading>保存中</su-button>
<su-input-number value="1" min="1" max="99"></su-input-number>
```

Boolean attribute 遵循 HTML 语义：只要属性存在就表示 true。需要设置为 false 时，请移除 attribute 或通过 JS property 赋值：

```html
<su-skeleton id="content-loading">
  <div>真实内容</div>
</su-skeleton>

<script type="module">
  document.querySelector('#content-loading').loading = false;
</script>
```

数组、对象、函数必须通过 DOM property 赋值：

```html
<su-select id="city"></su-select>

<script type="module">
  const city = document.querySelector('#city');
  city.options = [
    { label: '上海', value: 'sh' },
    { label: '北京', value: 'bj' },
  ];
</script>
```

纯 HTML 场景可以使用 `itemsJson` / `optionsJson`：

```html
<su-menu
  activeKey="dashboard"
  itemsJson='[{"key":"dashboard","label":"工作台"},{"key":"orders","label":"订单"}]'
>
</su-menu>
```

JSON 字符串解析失败时组件会回退为空数组，不会抛出运行时异常。

## 表单提交

表单控件支持 Form Associated Custom Elements。设置 `name` 后，控件值会进入外层原生表单的 `FormData`；`disabled` 控件不会提交，调用 `form.reset()` 会恢复初始值。

```html
<form id="profile-form">
  <su-input name="nickname" value="Silence"></su-input>
  <su-date-picker name="birthday" label="出生日期"></su-date-picker>
  <su-cascader name="region"></su-cascader>
  <su-upload name="avatar" accept="image/*" label="上传头像"></su-upload>
  <su-select name="city" optionsJson='[{"label":"上海","value":"sh"}]'></su-select>
  <su-checkbox name="agreement" value="accepted" label="同意协议"></su-checkbox>
  <su-button native-type="submit">提交</su-button>
</form>

<script type="module">
  document.querySelector('#profile-form').addEventListener('submit', (event) => {
    event.preventDefault();
    console.log(Object.fromEntries(new FormData(event.currentTarget)));
  });
</script>
```

支持 `name` 的组件：`su-input`、`su-date-picker`、`su-cascader`、`su-upload`、`su-select`、`su-textarea`、`su-input-number`、`su-checkbox`、`su-radio-group`、`su-switch`。

## 事件监听

组件自定义事件使用 `CustomEvent`，业务数据放在 `event.detail` 中。事件会设置 `bubbles: true` 与 `composed: true`，便于外层容器和宿主框架监听。

```html
<su-input id="keyword"></su-input>

<script type="module">
  document.querySelector('#keyword').addEventListener('input-change', (event) => {
    console.log(event.detail.value);
  });
</script>
```

常见事件包括：

| 事件           | 组件                                                                                                                                                     | detail                    |
| -------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------- |
| `input-change` | `su-input`、`su-textarea`                                                                                                                                | `{ value }`               |
| `change`       | `su-date-picker`、`su-cascader`、`su-upload`、`su-select`、`su-input-number`、`su-checkbox`、`su-radio-group`、`su-switch`、`su-tabs`、`su-theme-toggle` | 见对应组件文档            |
| `reject`       | `su-upload`                                                                                                                                              | `{ rejected }`            |
| `select`       | `su-menu`、`su-dropdown`、`su-tree`                                                                                                                      | 见对应组件文档            |
| `expand`       | `su-tree`                                                                                                                                                | `{ key, expanded, node }` |
| `close`        | `su-modal`、`su-drawer`、`su-alert`、`su-message`、`su-notification`、`su-popconfirm`                                                                    | 关闭来源或空 detail       |
| `confirm`      | `su-modal`、`su-popconfirm`                                                                                                                              | 无，可调用 preventDefault |
| `cancel`       | `su-popconfirm`                                                                                                                                          | 无                        |
| `page-change`  | `se-table`、`se-pagination`                                                                                                                              | `{ currentPage }`         |
| `sort-change`  | `se-table`                                                                                                                                               | `{ column, direction }`   |

## 框架接入

Vue 需要把 `su-` / `se-` 标签标记为原生自定义元素：

```ts
vue({
  template: {
    compilerOptions: {
      isCustomElement: (tag) => tag.startsWith('su-') || tag.startsWith('se-'),
    },
  },
});
```

React 19 之前对自定义元素的复杂属性和自定义事件支持有限。复杂数据建议用 ref 赋值，事件建议用 `addEventListener`。

```tsx
const tableRef = useRef<HTMLElement>(null);

useEffect(() => {
  const table = tableRef.current as HTMLElement & { columns: unknown[]; data: unknown[] };
  table.columns = columns;
  table.data = rows;
}, [columns, rows]);
```

包内置 `HTMLElementTagNameMap` 声明。在原生 TypeScript 中，`document.querySelector('su-input')` 与 `document.createElement('su-tabs')` 可以直接推断为对应组件类型。

## 样式与主题

组件内部样式运行在 Shadow DOM 中，业务项目不要依赖穿透内部 DOM 类名。可通过 CSS 变量覆盖主题：

```css
:root {
  --su-color-primary: #2563eb;
  --su-color-primary-hover: #1d4ed8;
  --su-radius-sm: 4px;
}
```

运行时主题 API 见[主题定制](./theme)。
