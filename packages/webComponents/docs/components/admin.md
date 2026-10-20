# 后台管理增强

这些是基础后台交互组件，不包含真实接口、登录授权或服务端权限校验。

<ClientOnly><AdminDemo /></ClientOnly>

## Form 校验 `su-form`

用 `su-form` 包裹原生 `<form novalidate>`。原生表单必须位于 light DOM，不能把具名控件放到另一个封闭 Shadow DOM 中。`novalidate` 让提交先进入整表规则校验；业务保存监听 `valid-submit`，组件不会发送请求。

```html
<su-form id="editor">
  <form novalidate>
    <su-form-item label="用户名" required>
      <su-input name="username" required></su-input>
    </su-form-item>
    <su-button native-type="submit">保存</su-button>
  </form>
</su-form>
```

```js
const form = document.querySelector('#editor');
form.rules = {
  username: [
    { required: true, message: '请输入用户名' },
    { validator: async (value, values) => (String(value).length < 2 ? '至少两个字符' : '') },
  ],
};
form.addEventListener('valid-submit', (event) => console.log(event.detail.values));
const valid = await form.validate(); // Promise<boolean>，失败时聚焦首个字段
```

| API               | 说明                                                                |
| ----------------- | ------------------------------------------------------------------- |
| rules             | 仅 property，`Record<string, FormRule[]>`；按 name 匹配             |
| errors            | 校验结果 `Record<string, string>`，调用方应通过规则更新而非直接写入 |
| validate()        | 依次执行必填、自定义同步/异步规则和已支持的原生约束                 |
| reset()           | 重置内部原生 form 并清除错误                                        |
| validate 事件     | `{ valid, errors }`                                                 |
| valid-submit 事件 | `{ values }`；只有成功校验才发出                                    |

异步校验遇到编辑、重置、卸载或新一次校验会丢弃旧结果；validator 抛错视为校验失败。禁用字段不校验、不包含于 values。推荐一个 name 对应一个自定义控件；多个同名字段会合并 values。

共享 `FormValueController` 现在把内部原生约束桥接到 `ElementInternals.setValidity`。Input 支持 `required`、`pattern`，Textarea/Select 支持 `required`。FormItem 的 label/message 会同步为自定义控件内部输入元素的可访问名称/描述，错误通过同一 Shadow DOM 内的隐藏文案关联，而不是无效的跨 Shadow DOM ID 引用。原生 input 等直接插槽使用者应自行提供原生 label/描述。

这不代表所有控件已经提供所有 HTML 约束属性：级联选择、单选组等复杂控件应通过 rules 定义业务规则。无 ElementInternals 的环境可显式调用 validate，但原生提交行为仍需遵循兼容性说明。

## Select 搜索和多选

新增 `multiple`、`values: string[]`（仅 property）、`searchable`、`clearable`、`remote`、`loading`、`required`、`label`。单选继续使用 `value`；多选使用 `values`，提交时按同一 name 写入多个 FormData 项。

本地搜索不区分大小写，已选项始终保留，避免搜索导致误取消。多选保持原生列表交互，桌面端可使用 Ctrl/Command 或 Shift 选择。`change.detail.value` 在多选时是数组，单选时仍是字符串。

`remote` 模式只发出 `search` 事件 `{ query }`，不执行本地过滤；调用方负责请求、防抖、过期响应保护和更新 options/loading。loading 阻止选择和清空，但允许继续搜索。

## 日期范围 `su-date-range`

新增独立组件，保留 `su-date-picker` 的单日期行为。`value` 为仅 property 的 `[开始日期, 结束日期]`，格式 `YYYY-MM-DD`；支持 `name`、`label`、`min`、`max`、`required`、`disabled`、`readonly`，`change.detail.value` 为新数组。

同一 name 顺序提交两项，使用 `formData.getAll(name)` 获取。结束早于开始会校验失败，不会偷偷交换输入。支持原生表单重置和继承 fieldset 禁用；暂不含时间、快捷范围和自定义日历弹层。

## 多级 Menu

`MenuItem` 新增 `children`、`disabled`、`iconName`；旧 `icon` 文本兼容保留。`expandedKeys`（仅 property）控制展开。

点击父节点只展开/收起，并发出 `expand` `{ key, expanded }`；点击叶子保留原 `select` 事件结构。上下/Home/End 在可见可用项间移动，左右键展开或返回上级。收起模式保持内联层级展开和标题提示，暂不提供悬浮子菜单。

## Table 列筛选

`Column.filterable: true` 现在会渲染列搜索框。`filters`（仅 property）为 `Record<string, string>`；本地按原始字段值做不区分大小写的包含匹配，多列条件取交集，先筛选再排序分页。

筛选操作重置到第一页，并发出 `filter-change` `{ filters }`。`remote` 模式不筛本地数据，调用方负责把 filters 传给服务端，返回新 data/total。暂不提供枚举多选和自定义筛选浮层。

## 权限树勾选

`checkable` 开启勾选；`checkedKeys`（仅 property）维护完整勾选 key 集合；`checkStrictly` 关闭父子联动。联动模式父节点状态由可用子节点推导，支持半选；回显时应传叶子 key 或上次事件返回的完整集合。

禁用节点及其子树不参与祖先勾选联动，也不会被清空。点击或 Space 勾选，Enter 保留节点选择。`check` 事件返回 `{ key, checked, checkedKeys, halfCheckedKeys }`；原 `select`/`expand` 保留。

## UnoCSS 的接入决策

本轮不把组件内部迁移到 UnoCSS。现有样式统一使用 Lit CSS、共享样式与主题变量；图标也不需要 UnoCSS。

当前仅库整包构建保留历史插件配置，组件没有样式注入占位符，不能宣称已全面使用 UnoCSS。按需构建与文档构建也未使用它。

建议将 UnoCSS 用在宿主后台页面布局；若未来要用在组件内部，需要同时处理 TS 扫描、Shadow DOM 样式注入、所有构建入口一致性、动态类名白名单以及主题变量映射，成本高于本轮收益。依据见 [UnoCSS Shadow DOM 文档](https://unocss.dev/integrations/vite#shadow-dom)。本轮保留依赖，不进行无关的构建迁移。
