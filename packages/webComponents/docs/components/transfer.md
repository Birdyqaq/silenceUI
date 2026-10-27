# Transfer 穿梭框

适合人员分配和角色授权。左右搜索、当前结果全选与双向批量移动，目标集合通过 targetKeys 维护；不包含后端权限保存。

<script setup>
import { ref, watchEffect } from 'vue';
const transfer = ref();
const department = ref();
const result = ref('请选择部门和至少一名人员，再提交。');
watchEffect(() => {
  if (transfer.value) transfer.value.items = [
    { key: 'alice', label: 'Alice · 研发' }, { key: 'bob', label: 'Bob · 运营' },
    { key: 'carol', label: 'Carol · 研发' }, { key: 'locked', label: '停用人员', disabled: true },
  ];
  if (department.value) department.value.nodes = [{ key: 'dev', label: '研发部' }, { key: 'ops', label: '运营部' }];
});
function submit(event) { result.value = JSON.stringify(Array.from(new FormData(event.target).entries())); }
</script>

<ClientOnly>
  <form style="display:grid;gap:20px" @submit.prevent="submit">
    <su-tree-select ref="department" name="department" label="分配部门" required clearable></su-tree-select>
    <su-transfer ref="transfer" name="members" label="授权人员" searchable required @change="result = JSON.stringify($event.detail)"></su-transfer>
    <div><button type="submit">提交分配</button> · <button type="reset">重置分配</button></div>
    <p role="status">{{ result }}</p>
  </form>
</ClientOnly>

## 接入

```ts
import 'silenceui/style.css';
import 'silenceui/components/form/transfer';
const control = document.querySelector('su-transfer')!;
control.items = [
  { key: 'alice', label: 'Alice' },
  { key: 'bob', label: 'Bob' },
];
control.targetKeys = ['alice'];
control.addEventListener('change', (event) => console.log((event as CustomEvent).detail));
```

根入口导出 `SuTransfer`、`TransferItem`。数组仅通过 DOM property 传入，不支持 JSON attribute。

| 属性                | 类型           | 默认值 | 说明                                      |
| ------------------- | -------------- | ------ | ----------------------------------------- |
| items               | TransferItem[] | []     | key、label、disabled?；非法/重复 key 忽略 |
| targetKeys          | string[]       | []     | 右侧集合；去重后展示，不修改原数组        |
| searchable          | boolean        | false  | 双侧独立搜索                              |
| disabled / required | boolean        | false  | 整体禁用 / 必填                           |
| name / label        | string         | ''     | 表单字段 / 可访问名称                     |

用户移动时派发冒泡、跨 Shadow DOM 的 `change`：`{ targetKeys, direction: 'left' | 'right', movedKeys }`。程序赋值、搜索及临时勾选不派发 change；这些操作不会误清除表单规则错误。

## 行为与边界

- 全选只作用于当前筛选结果中的可用项；半选状态使用原生 checkbox indeterminate。
- 移动只处理当前可见、已勾选且可用的条目，隐藏勾选仍保留；移动后清空本次移动项的临时勾选。
- 禁用项不可勾选或移动。右侧禁用项保持可见，但不计入 FormData 和必填校验。
- 新数据替换后保留目标 key 及原标签；未知 key 显示自身。原禁用状态保留，直到新数据明确恢复。取消选择释放对应缓存。
- 支持 native FormData、fieldset、reset、状态恢复及 su-form/FormItem。右侧可提交 key 按同名字段重复提交；无 ElementInternals 时需通过 su-form 校验与收集值。
- checkbox 使用原生 Tab / Space 操作；移动按钮 Enter/Space；错误聚焦到可见的列表入口。窄屏自动堆叠两侧面板，明暗模式和主题色共用全局变量。

不包含远程分页、拖拽排序或权限持久化；服务端必须自行校验人员和授权范围。
