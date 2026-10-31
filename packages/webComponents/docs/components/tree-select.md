# TreeSelect 树选择

部门、组织或分类选择。复用 Tree 键盘导航；多选采用独立勾选，不做父子级联。默认单选。

<script setup>
import { ref, watchEffect } from 'vue';
const single = ref();
const multi = ref();
const result = ref('尚未选择');
function submit(event) {
  result.value = JSON.stringify(Array.from(new FormData(event.target).entries()));
}
watchEffect(() => {
  if (!single.value || !multi.value) return;
  const nodes = [{ key: 'company', label: '总公司', children: [
    { key: 'dev', label: '研发部' }, { key: 'ops', label: '运营部' },
    { key: 'locked', label: '停用部门', disabled: true, children: [{ key: 'child', label: '停用子部门' }] },
  ] }];
  single.value.nodes = nodes;
  multi.value.nodes = nodes;
  multi.value.values = ['dev'];
});
</script>

<ClientOnly>
  <form style="display:grid;gap:20px;max-width:520px" @submit.prevent="submit">
    <su-tree-select ref="single" label="所属部门" name="department" searchable clearable required @change="result = JSON.stringify($event.detail.value)"></su-tree-select>
    <su-tree-select ref="multi" label="授权部门" name="departments" multiple searchable clearable @change="result = JSON.stringify($event.detail.value)"></su-tree-select>
    <p role="status">当前选择：{{ result }}</p>
    <div><button type="submit">提交表单</button> · <button type="reset">重置表单</button></div>
  </form>
</ClientOnly>

## 接入

```ts
import 'silenceui/style.css';
import 'silenceui/components/form/tree-select';
const control = document.querySelector('su-tree-select')!;
control.nodes = [{ key: 'dev', label: '研发部' }];
control.value = 'dev';
control.addEventListener('change', (event) => console.log((event as CustomEvent).detail.value));
```

| 属性                   | 类型       | 默认值 | 说明                                       |
| ---------------------- | ---------- | ------ | ------------------------------------------ |
| nodes                  | TreeNode[] | []     | 仅 property，key/label/disabled?/children? |
| value                  | string     | ''     | 单选 key                                   |
| values                 | string[]   | []     | 仅 property，多选 key，重复及非法值忽略    |
| multiple               | boolean    | false  | 独立多选，不级联父子                       |
| searchable / clearable | boolean    | false  | 搜索 / 清空按钮                            |
| disabled / required    | boolean    | false  | 禁用 / 原生必填约束                        |
| name / label           | string     | ''     | 提交字段名 / 可访问标签                    |
| placeholder            | string     | 请选择 | 空选择提示                                 |

用户修改派发冒泡且跨 Shadow DOM 的 `change`，detail `{ value }` 为单选字符串或多选字符串数组；程序赋值不派发事件。搜索保留匹配节点的祖先路径，不修改选中值。父节点可独立选择；禁用节点及其子树不可操作，也不参与成功提交。非法/重复 key 和循环引用被忽略。

已选节点从新数据中消失时保留 key 和旧名称；未知 key 直接显示 key。已知禁用状态也保留，只有新数据明确恢复后才重新可提交。清空或取消选择会释放相应缓存。

## 表单与键盘

支持原生 FormData、fieldset 禁用、reset、状态恢复及 su-form / su-form-item 的规则与错误关联。单选提交一个值，多选按同名字段重复提交；required 根据可提交选择判断。无 ElementInternals 的环境仅保留 UI 与 su-form 校验能力。

触发器 Enter/Space 打开；ArrowDown 进入树，树内方向键展开/移动、Enter 选择、Space 独立勾选；Escape 关闭并返回触发器。单选后关闭、多选保持打开，外部点击关闭。搜索框 ArrowDown 进入结果。支持明暗模式和自定义主色。

关闭或卸载后的旧树事件不会修改当前值。搜索期间的临时展开不覆盖搜索前的展开状态；异步打开时若焦点已移至外部，组件不再抢回。单选后的焦点恢复支持嵌套 Shadow DOM，同时尊重业务 change 回调主动转移的焦点。

不包含远程请求、虚拟滚动、父子级联或权限保存；节点数组通过 DOM property 赋值，不提供 JSON attribute。
