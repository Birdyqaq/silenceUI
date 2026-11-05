# SortableList 可排序列表

用于调整菜单、规则或其他条目的顺序。桌面可拖动左侧手柄，键盘和触屏可使用上移、下移按钮。

<script setup>
import { ref } from 'vue';

const items = ref([
  { key: 'overview', label: '工作台' },
  { key: 'members', label: '成员管理' },
  { key: 'shifts', label: '排班管理' },
]);
</script>

<ClientOnly>
  <su-sortable-list label="侧栏菜单顺序" :items.prop="items" @change="items = $event.detail.items"></su-sortable-list>
</ClientOnly>

## 接入

```ts
import 'silenceui/style.css';
import 'silenceui/components/data/sortable-list';
import type { SortableListChangeDetail } from 'silenceui/components/data/sortable-list';

const list = document.querySelector('su-sortable-list')!;
list.items = [
  { key: 'overview', label: '工作台' },
  { key: 'shifts', label: '排班管理' },
];
list.addEventListener('change', (event) => {
  const { items } = (event as CustomEvent<SortableListChangeDetail>).detail;
  // 将 items.map(item => item.key) 交给应用保存。
});
```

| 属性       | 类型                          | 说明                                                            |
| ---------- | ----------------------------- | --------------------------------------------------------------- |
| `items`    | `readonly SortableListItem[]` | 通过 property 传入条目。每项包含唯一 `key` 和显示名称 `label`。 |
| `label`    | `string`                      | 列表的可访问名称，默认「可排序列表」。                          |
| `disabled` | `boolean`                     | 禁用拖动和移动按钮。                                            |

用户完成排序后，组件以新数组更新 `items`，并派发冒泡的 `change`。事件详情包含 `items`、移动项的 `key`、从零开始的 `fromIndex` 和 `toIndex`。向下拖动时插到目标之后，向上拖动时插到目标之前。原数组保留原顺序，业务应用负责保存新顺序。

重复 key 会禁用排序操作。替换 `items` 会让正在进行的拖动失效。通过 `item` CSS Part 定制行样式。
