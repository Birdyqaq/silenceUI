# 表单组件

## Select 选择器 `su-select`

```html
<su-select id="city" placeholder="请选择城市"></su-select>
<script>
  const select = document.querySelector('#city')
  select.options = [
    { label: '上海', value: 'sh' },
    { label: '北京', value: 'bj' },
    { label: '深圳', value: 'sz', disabled: true }
  ]
  select.addEventListener('change', (e) => console.log(e.detail.value))
</script>
```

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| options | 选项（JS 设置） | `{ label, value, disabled? }[]` | `[]` |
| optionsJson | 选项（JSON 字符串 attribute） | `string` | `''` |
| value | 当前值 | `string` | `''` |
| placeholder | 占位提示 | `string` | `请选择` |
| disabled | 禁用 | `boolean` | `false` |

事件：`change` → `{ value }`

## InputNumber 数字输入框 `su-input-number`

```html
<su-input-number value="1" min="1" max="99" step="1"></su-input-number>
```

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| value | 当前值 | `number` | `0` |
| min / max | 最小/最大值 | `number` | 不限 |
| step | 步进 | `number` | `1` |
| disabled | 禁用 | `boolean` | `false` |

事件：`change` → `{ value }`

## Checkbox 复选框 `su-checkbox`

```html
<su-checkbox label="记住我" checked></su-checkbox>
```

事件：`change` → `{ checked }`

## RadioGroup 单选组 `su-radio-group`

```html
<su-radio-group id="status"></su-radio-group>
<script>
  const group = document.querySelector('#status')
  group.options = [
    { label: '启用', value: 'on' },
    { label: '停用', value: 'off' }
  ]
</script>
```

事件：`change` → `{ value }`

## Switch 开关 `su-switch`

```html
<su-switch checked></su-switch>
```

事件：`change` → `{ checked }`

## Textarea 多行输入 `su-textarea`

```html
<su-textarea placeholder="请输入备注" rows="4"></su-textarea>
```

## FormItem 表单项 `su-form-item`

为任意控件提供 label、必填标记与校验信息展示：

```html
<su-form-item label="用户名" required message="用户名不能为空" status="error">
  <su-input placeholder="请输入用户名"></su-input>
</su-form-item>
```

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| label | 标签文案 | `string` | `''` |
| required | 必填标记 | `boolean` | `false` |
| message | 提示信息 | `string` | `''` |
| status | 信息状态 | `'default' \| 'error' \| 'warning' \| 'success'` | `default` |
