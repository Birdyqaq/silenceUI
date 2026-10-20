# Input 输入框

用于接收用户文本输入，支持标签、只读/禁用、错误提示及变化事件。

## 基础用法

<ClientOnly>
  <div style="display: grid; gap: 12px; max-width: 420px; margin: 20px 0;">
    <su-input placeholder="请输入内容"></su-input>
    <su-input label="带标签" placeholder="标签输入框"></su-input>
    <su-input placeholder="禁用状态" disabled></su-input>
  </div>
</ClientOnly>

```html
<su-input placeholder="请输入内容"></su-input>
<su-input label="带标签" placeholder="标签输入框"></su-input>
<su-input placeholder="禁用状态" disabled></su-input>
```

## 错误与辅助文案

`helperText` 会通过内部 `aria-describedby` 与输入框关联，清空文案时同步移除关联；`error` 同步设置 `aria-invalid`。这些属性负责提示展示，校验规则由业务层提供。

<ClientOnly>
  <div style="display: grid; gap: 12px; max-width: 420px; margin: 20px 0;">
    <su-input
      label="邮箱"
      type="email"
      placeholder="name@example.com"
      helperText="我们只会用来通知重要信息">
    </su-input>
    <su-input
      label="验证码"
      placeholder="请输入验证码"
      helperText="验证码有误，请重新输入"
      error>
    </su-input>
  </div>
</ClientOnly>

```html
<su-input
  label="邮箱"
  type="email"
  placeholder="name@example.com"
  helperText="我们只会用来通知重要信息"
>
</su-input>

<su-input label="验证码" placeholder="请输入验证码" helperText="验证码有误，请重新输入" error>
</su-input>
```

## 监听输入

Input 组件会在输入时触发 `input-change` 事件，返回当前值。

```html
<su-input id="demo" placeholder="实时监听"></su-input>

<script type="module">
  const input = document.querySelector('#demo');
  input.addEventListener('input-change', (e) => {
    console.log('当前值', e.detail.value);
  });
</script>
```

## 一键清空

禁用（包括继承 fieldset 禁用）或只读时，清空按钮同时禁用，不进入 Tab 顺序；重新启用后可正常清空并聚焦输入框。

<ClientOnly>
  <div style="display: grid; gap: 12px; max-width: 420px; margin: 20px 0;">
    <su-input clearable placeholder="可清空的输入框"></su-input>
  </div>
</ClientOnly>

```html
<su-input clearable placeholder="可清空的输入框"></su-input>
```

## API

### 属性

| 属性        | 说明             | 类型      | 默认值   |
| ----------- | ---------------- | --------- | -------- |
| value       | 输入框的值       | `string`  | `''`     |
| name        | 表单字段名       | `string`  | `''`     |
| placeholder | 占位符           | `string`  | `请输入` |
| type        | 输入类型         | `string`  | `text`   |
| disabled    | 是否禁用         | `boolean` | `false`  |
| readonly    | 只读             | `boolean` | `false`  |
| error       | 是否展示错误态   | `boolean` | `false`  |
| label       | 标签文本         | `string`  | `''`     |
| helperText  | 辅助说明文本     | `string`  | `''`     |
| clearable   | 是否显示清空按钮 | `boolean` | `false`  |

### 事件

| 事件名       | 说明               | 回调参数            |
| ------------ | ------------------ | ------------------- |
| input-change | 输入内容变化时触发 | `{ value: string }` |

设置 `name` 后，组件会参与外层原生表单提交，并在 `form.reset()` 时恢复初始值。
