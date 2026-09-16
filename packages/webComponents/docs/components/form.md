# 表单组件

表单组件以原生控件行为为基础，统一使用主题 token、焦点样式和 `CustomEvent`。复杂选项通过 DOM property 赋值；纯 HTML 场景可使用 `optionsJson`。

所有控件设置 `name` 后都能参与外层原生 `<form>` 提交，并支持 `form.reset()`。复选框和开关仅在选中时提交其 `value`。

<ClientOnly>
  <FormDemo />
</ClientOnly>

```html
<form id="settings">
  <su-input name="keyword" value="Lit"></su-input>
  <su-switch name="enabled" value="yes"></su-switch>
  <su-button native-type="submit">保存</su-button>
</form>
```

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
| `name`        | 表单字段名                    | `string`         | `''`     |
| `placeholder` | 占位提示                      | `string`         | `请选择` |
| `disabled`    | 是否禁用                      | `boolean`        | `false`  |

`SelectOption`：

| 字段       | 说明     | 类型               |
| ---------- | -------- | ------------------ |
| `label`    | 选项文本 | `string`           |
| `value`    | 选项值   | `string \| number` |
| `disabled` | 是否禁用 | `boolean`          |

事件：`change`，detail 为 `{ value: string }`。

## DatePicker 日期选择器 `su-date-picker`

基于原生日期输入，值统一使用 `YYYY-MM-DD`，并支持外层原生表单提交与 reset：

```html
<su-date-picker
  name="startDate"
  label="开始日期"
  value="2026-08-12"
  min="2026-08-01"
  max="2026-08-31"
></su-date-picker>
```

用户选择超出 `min` / `max` 的日期时，组件会将值裁剪到最近边界。可通过 `focus()` 聚焦，也可调用 `showPicker()` 打开浏览器原生日期面板。

| 属性       | 说明                          | 类型      | 默认值  |
| ---------- | ----------------------------- | --------- | ------- |
| `value`    | 当前日期，格式为 `YYYY-MM-DD` | `string`  | `''`    |
| `name`     | 表单字段名                    | `string`  | `''`    |
| `min`      | 最小日期                      | `string`  | `''`    |
| `max`      | 最大日期                      | `string`  | `''`    |
| `label`    | 可见标签，同时作为无障碍名称  | `string`  | `''`    |
| `disabled` | 是否禁用                      | `boolean` | `false` |
| `readonly` | 是否只读                      | `boolean` | `false` |

事件：`change`，detail 为 `{ value: string }`。

## Cascader 级联选择 `su-cascader`

用于地区、组织架构等层级选项。选中的完整路径是字符串数组，表单提交值为该数组的 JSON 字符串：

```html
<su-cascader id="region" name="region" placeholder="请选择地区"></su-cascader>

<script type="module">
  const cascader = document.querySelector('#region');
  cascader.options = [
    {
      value: 'cn',
      label: '中国',
      children: [
        { value: 'sh', label: '上海' },
        { value: 'bj', label: '北京' },
      ],
    },
  ];
</script>
```

纯 HTML 可使用 `optionsJson` 和 `valueJson`。选项支持 `value`、`label`、`disabled` 和递归 `children`。

| 属性          | 说明                              | 类型               | 默认值   |
| ------------- | --------------------------------- | ------------------ | -------- |
| `options`     | 选项树，需通过 JS property 设置   | `CascaderOption[]` | `[]`     |
| `optionsJson` | 选项 JSON 字符串                  | `string`           | `''`     |
| `value`       | 选中路径，需通过 JS property 设置 | `string[]`         | `[]`     |
| `valueJson`   | 选中路径 JSON 字符串              | `string`           | `''`     |
| `name`        | 表单字段名                        | `string`           | `''`     |
| `placeholder` | 未选择时的提示                    | `string`           | `请选择` |
| `separator`   | 路径展示分隔符                    | `string`           | `/`      |
| `disabled`    | 是否禁用                          | `boolean`          | `false`  |
| `open`        | 是否展开，会 reflect 到 attribute | `boolean`          | `false`  |

事件：`change`，detail 为 `{ value: string[], option }`。支持方向键、Home/End、Enter/Space、Escape、外部点击关闭和焦点恢复。

## Upload 文件选择 `su-upload`

支持点击和拖拽选择文件，并在提交原生表单时写入 `File`。组件只负责选择与校验，不会自动发送网络请求：

```html
<su-upload
  name="attachments"
  label="选择附件"
  hint="支持 PNG、JPEG 和 PDF，单个文件不超过 5 MB"
  accept="image/*,.pdf"
  max-size="5242880"
  max-count="3"
  multiple
></su-upload>
```

| 属性        | 说明                                | 类型      | 默认值     |
| ----------- | ----------------------------------- | --------- | ---------- |
| `files`     | 已选择文件，需通过 JS property 设置 | `File[]`  | `[]`       |
| `name`      | 表单字段名                          | `string`  | `''`       |
| `accept`    | MIME 类型或扩展名规则               | `string`  | `''`       |
| `multiple`  | 是否允许多选                        | `boolean` | `false`    |
| `max-size`  | 单文件字节上限，0 表示不限制        | `number`  | `0`        |
| `max-count` | 多选数量上限，0 表示不限制          | `number`  | `0`        |
| `label`     | 选择区域文案及无障碍名称            | `string`  | `选择文件` |
| `hint`      | 辅助说明                            | `string`  | `''`       |
| `disabled`  | 是否禁用                            | `boolean` | `false`    |

- `change`：选择、移除或调用 `clear()` 后触发，detail 为 `{ files: File[] }`。
- `reject`：文件校验失败时触发，detail 为 `{ rejected: UploadRejection[] }`；原因是 `type`、`size` 或 `count`。

可调用 `focus()` 聚焦文件输入，调用 `clear()` 清空文件。多文件表单提交时会使用相同 `name` 写入多条文件记录。

## InputNumber 数字输入框 `su-input-number`

```html
<su-input-number value="1" min="1" max="99" step="1"></su-input-number>
```

输入或点击按钮时会按 `min` / `max` 裁剪最终值。

| 属性       | 说明       | 类型      | 默认值                    |
| ---------- | ---------- | --------- | ------------------------- |
| `value`    | 当前值     | `number`  | `0`                       |
| `name`     | 表单字段名 | `string`  | `''`                      |
| `min`      | 最小值     | `number`  | `Number.MIN_SAFE_INTEGER` |
| `max`      | 最大值     | `number`  | `Number.MAX_SAFE_INTEGER` |
| `step`     | 步进       | `number`  | `1`                       |
| `disabled` | 是否禁用   | `boolean` | `false`                   |

事件：`change`，detail 为 `{ value: number }`。

## Checkbox 复选框 `su-checkbox`

```html
<su-checkbox label="记住我" checked></su-checkbox>
```

| 属性       | 说明           | 类型      | 默认值  |
| ---------- | -------------- | --------- | ------- |
| `checked`  | 是否选中       | `boolean` | `false` |
| `disabled` | 是否禁用       | `boolean` | `false` |
| `name`     | 表单字段名     | `string`  | `''`    |
| `value`    | 选中时提交的值 | `string`  | `on`    |
| `label`    | 文案           | `string`  | `''`    |

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
| `name`        | 表单字段名及内部 radio name     | `string`        | 随机生成 |
| `disabled`    | 是否禁用整个单选组              | `boolean`       | `false`  |

事件：`change`，detail 为 `{ value: string }`。

## Switch 开关 `su-switch`

```html
<su-switch checked></su-switch>
```

| 属性       | 说明           | 类型      | 默认值  |
| ---------- | -------------- | --------- | ------- |
| `checked`  | 是否开启       | `boolean` | `false` |
| `disabled` | 是否禁用       | `boolean` | `false` |
| `name`     | 表单字段名     | `string`  | `''`    |
| `value`    | 开启时提交的值 | `string`  | `on`    |

事件：`change`，detail 为 `{ checked: boolean }`。

## Textarea 多行输入 `su-textarea`

```html
<su-textarea placeholder="请输入备注" rows="4"></su-textarea>
```

| 属性          | 说明       | 类型      | 默认值   |
| ------------- | ---------- | --------- | -------- |
| `value`       | 当前值     | `string`  | `''`     |
| `name`        | 表单字段名 | `string`  | `''`     |
| `placeholder` | 占位提示   | `string`  | `请输入` |
| `rows`        | 行数       | `number`  | `4`      |
| `disabled`    | 是否禁用   | `boolean` | `false`  |
| `readonly`    | 是否只读   | `boolean` | `false`  |

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
| `su-date-picker`  | `change`       | `{ value: string }`    |
| `su-cascader`     | `change`       | `{ value, option }`    |
| `su-upload`       | `change`       | `{ files: File[] }`    |
| `su-upload`       | `reject`       | `{ rejected }`         |
| `su-input-number` | `change`       | `{ value: number }`    |
| `su-checkbox`     | `change`       | `{ checked: boolean }` |
| `su-radio-group`  | `change`       | `{ value: string }`    |
| `su-switch`       | `change`       | `{ checked: boolean }` |
| `su-textarea`     | `input-change` | `{ value: string }`    |
