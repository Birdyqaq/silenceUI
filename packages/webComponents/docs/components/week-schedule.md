# WeekSchedule 周排班视图

按周查看值班、巡检与预约。宽容器并排显示七天，窄容器按日期纵向排列。

<script setup>
import { ref } from 'vue';

const selected = ref('');
const shifts = [
  { id: 'support', date: '2026-11-02', title: '技术支持', time: '09:00–12:00' },
  { id: 'handover', date: '2026-11-04', title: '夜班交接', time: '22:00' },
  { id: 'patrol', date: '2026-11-08', title: '周末巡检', time: '10:00–11:00' },
];
</script>

<ClientOnly>
  <su-week-schedule date="2026-11-04" :items.prop="shifts" @item-select="selected = $event.detail.item.title"></su-week-schedule>
  <p v-if="selected" role="status">已选排班 {{ selected }}</p>
</ClientOnly>

## 接入

```ts
import 'silenceui/style.css';
import 'silenceui/components/data/week-schedule';

const schedule = document.querySelector('su-week-schedule')!;
schedule.date = '2026-11-04';
schedule.items = [{ id: 'support', date: '2026-11-02', title: '技术支持', time: '09:00–12:00' }];
```

| 属性    | 类型                          | 说明                                                                                                        |
| ------- | ----------------------------- | ----------------------------------------------------------------------------------------------------------- |
| `date`  | `string`                      | 周内任意日期，格式为 `YYYY-MM-DD`。未提供有效日期时显示本地当前周。                                         |
| `items` | `readonly WeekScheduleItem[]` | 通过 property 传入排班条目。每项包含 `id`、`date`、`title` 和可选的 `time` 展示文字。同一天按传入顺序展示。 |

| 事件          | `detail`                     | 触发时机                                   |
| ------------- | ---------------------------- | ------------------------------------------ |
| `week-change` | `{ start: string }`          | 用户切换周时触发，`start` 为新一周的周一。 |
| `item-select` | `{ item: WeekScheduleItem }` | 点击或用键盘激活排班条目。                 |

宿主可监听 `week-change` 加载对应周的数据，并替换 `items`。程序设置 `date` 时静默更新。日期按公历周一至周日组织，跨日班次可由宿主拆成多条记录。通过 `week`、`day`、`entry` CSS Parts 定制。

相关组件见 [Calendar 月视图](./data#calendar-月视图) 和 [DateTimeRange 日期时间范围](./time#日期时间范围与跨日排班)。
