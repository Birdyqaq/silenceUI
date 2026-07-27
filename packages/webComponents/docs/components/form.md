# 表单组件

表单组件以原生控件行为为基础，统一使用主题 token、焦点样式和 `CustomEvent`。复杂选项通过 DOM property 赋值；纯 HTML 场景可使用 `optionsJson`。

## Select 选择器 `su-select`

```html
<su-select id="city" placeholder="请选择城市"></su-select>

<script type="module">
  const select = document.querySelector('#city');
  select.options = [
    { label: '上海', value: 'sh' },
    { label: '北京', value: 'bj' },
    { label: '深圳', value: 'sz', disabled: true },
  ];
  select.addEventListener('change', (event) => console.log(event.detail.value));
</script>
```

纯 HTML：

```html
<su-select value="sh" optionsJson='[{"label":"上海","value":"sh"},{"label":"北京","value":"bj"}]'>
</su-select>
```

| 属性          | 说明                          | 类型             | 默认值   |
| ------------- | ----------------------------- | ---------------- | -------- |
| `options`     | 选项，需通过 JS property 设置 | `SelectOption[]` | `[]`     |
| `optionsJson` | 选项 JSON 字符串              | `string`         | `''`     |
| `value`       | 当前值                        | `string`         | `''`     |
| `placeholder` | 占位提示                      | `string`         | `请选择` |
| `disabled`    | 是否禁用                      | `boolean`        | `false`  |

`SelectOption`：

| 字段       | 说明     | 类型               |
| ---------- | -------- | ------------------ |
| `label`    | 选项文本 | `string`           |
| `value`    | 选项值   | `string \| number` |
| `disabled` | 是否禁用 | `boolean`          |

事件：`change`，detail 为 `{ value: string }`。

## InputNumber 数字输入框 `su-input-number`

```html
<su-input-number value="1" min="1" max="99" step="1"></su-input-number>
```

输入或点击按钮时会按 `min` / `max` 裁剪最终值。

| 属性       | 说明     | 类型      | 默认值                    |
| ---------- | -------- | --------- | ------------------------- |
| `value`    | 当前值   | `number`  | `0`                       |
| `min`      | 最小值   | `number`  | `Number.MIN_SAFE_INTEGER` |
| `max`      | 最大值   | `number`  | `Number.MAX_SAFE_INTEGER` |
| `step`     | 步进     | `number`  | `1`                       |
| `disabled` | 是否禁用 | `boolean` | `false`                   |

事件：`change`，detail 为 `{ value: number }`。

## Checkbox 复选框 `su-checkbox`

```html
<su-checkbox label="记住我" checked></su-checkbox>
```

| 属性       | 说明                              | 类型      | 默认值  |
| ---------- | --------------------------------- | --------- | ------- |
| `checked`  | 是否选中，会 reflect 到 attribute | `boolean` | `false` |
| `disabled` | 是否禁用                          | `boolean` | `false` |
| `label`    | 文案                              | `string`  | `''`    |

事件：`change`，detail 为 `{ checked: boolean }`。

## RadioGroup 单选组 `su-radio-group`

```html
<su-radio-group id="status" value="on"></su-radio-group>

<script type="module">
  const group = document.querySelector('#status');
  group.options = [
    { label: '启用', value: 'on' },
    { label: '停用', value: 'off' },
  ];
</script>
```

| 属性          | 说明                            | 类型            | 默认值   |
| ------------- | ------------------------------- | --------------- | -------- |
| `options`     | 单选项，需通过 JS property 设置 | `RadioOption[]` | `[]`     |
| `optionsJson` | 单选项 JSON 字符串              | `string`        | `''`     |
| `value`       | 当前值                          | `string`        | `''`     |
| `name`        | 内部 radio name                 | `string`        | 随机生成 |

事件：`change`，detail 为 `{ value: string }`。

## Switch 开关 `su-switch`

```html
<su-switch checked></su-switch>
```

| 属性       | 说明                              | 类型      | 默认值  |
| ---------- | --------------------------------- | --------- | ------- |
| `checked`  | 是否开启，会 reflect 到 attribute | `boolean` | `false` |
| `disabled` | 是否禁用                          | `boolean` | `false` |

事件：`change`，detail 为 `{ checked: boolean }`。

## Textarea 多行输入 `su-textarea`

```html
<su-textarea placeholder="请输入备注" rows="4"></su-textarea>
```

| 属性          | 说明     | 类型      | 默认值   |
| ------------- | -------- | --------- | -------- |
| `value`       | 当前值   | `string`  | `''`     |
| `placeholder` | 占位提示 | `string`  | `请输入` |
| `rows`        | 行数     | `number`  | `4`      |
| `disabled`    | 是否禁用 | `boolean` | `false`  |

事件：`input-change`，detail 为 `{ value: string }`。

## FormItem 表单项 `su-form-item`

为任意控件提供 label、必填标记与校验信息展示：

```html
<su-form-item label="用户名" required message="用户名不能为空" status="error">
  <su-input placeholder="请输入用户名"></su-input>
</su-form-item>
```

| 属性       | 说明             | 类型                                             | 默认值    |
| ---------- | ---------------- | ------------------------------------------------ | --------- |
| `label`    | 标签文案         | `string`                                         | `''`      |
| `required` | 是否显示必填标记 | `boolean`                                        | `false`   |
| `message`  | 提示信息         | `string`                                         | `''`      |
| `status`   | 信息状态         | `'default' \| 'error' \| 'warning' \| 'success'` | `default` |

## 事件汇总

| 组件              | 事件           | detail                 |
| ----------------- | -------------- | ---------------------- |
| `su-select`       | `change`       | `{ value: string }`    |
| `su-input-number` | `change`       | `{ value: number }`    |
| `su-checkbox`     | `change`       | `{ checked: boolean }` |
| `su-radio-group`  | `change`       | `{ value: string }`    |
| `su-switch`       | `change`       | `{ checked: boolean }` |
| `su-textarea`     | `input-change` | `{ value: string }`    |
