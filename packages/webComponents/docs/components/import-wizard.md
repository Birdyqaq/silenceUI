# ImportWizard 导入向导

`su-import-wizard` 提供选择文件、字段映射、校验预览、确认导入和结果展示。文件解析、业务校验与服务端写入通过适配器提供。

<script setup>
const fields = [{ key: 'name', label: '姓名', required: true }, { key: 'team', label: '部门' }];
const adapter = {
  async parse(file, signal) {
    const text = await file.text();
    signal.throwIfAborted();
    const rows = text.trim().split(/\r?\n/).map(line => line.split('\t'));
    return { columns: rows[0], rows: rows.slice(1) };
  },
  async validate(sheet, mapping, signal) {
    signal.throwIfAborted();
    const column = sheet.columns.indexOf(mapping.name);
    return sheet.rows.flatMap((row, i) => row[column]?.trim() ? [] : [{ row: i + 1, message: '姓名不能为空' }]);
  },
  async submit(sheet, mapping, signal) {
    signal.throwIfAborted();
    return { message: `演示完成：已模拟导入 ${sheet.rows.length} 行，没有写入服务器。` };
  },
};
</script>

## 在线示例

创建 UTF-8 的 `.tsv` 文件，首行为列名，字段间使用 Tab 分隔。该示例仅演示简单 TSV，不支持带引号或单元格换行的完整文件格式。可使用下面的内容：

```text
name	team
张三	研发
李四	运营
```

<ClientOnly>
<su-import-wizard :adapter.prop="adapter" :fields.prop="fields" accept=".tsv" :maxSize.prop="1048576" />
</ClientOnly>

## 接入与协议

```ts
import 'silenceui/style.css';
import 'silenceui/components/form/import-wizard';
import type { ImportAdapter } from 'silenceui/components/form/import-wizard';
```

| 属性                   | 默认值       | 说明                                                       |
| ---------------------- | ------------ | ---------------------------------------------------------- |
| `adapter`              | 无           | 仅 property；包含异步 `parse`、`validate`、`submit`        |
| `fields`               | `[]`         | 仅 property；`{ key, label, required? }[]`，key 非空且唯一 |
| `accept`               | `.csv,.xlsx` | 扩展名、MIME 或 MIME 通配符，逗号分隔                      |
| `maxSize` / `max-size` | `10485760`   | 文件大小上限，字节；必须为正有限数                         |

- `parse(file, signal)` 返回 `{ columns: string[], rows: string[][] }`。列名非空且唯一；数据非空、每行等宽、单元格为字符串。组件复制解析结果。
- `validate(sheet, mapping, signal)` 返回 `{ row, message }[]`。`row` 为从 1 开始的数据行号，不含表头。空数组表示通过；任何错误均阻止导入。
- `submit(sheet, mapping, signal)` 返回 `{ message: string }`，成功后进入结果页，并派发冒泡且跨 Shadow DOM 的 `import-complete`，`detail` 为 `{ message }`。
- `mapping` 为目标字段 key 到来源列名的映射；未选择的可选字段值为 `''`。必填字段必须映射，至少映射一个字段，来源列不能重复使用。
- 校验和提交接收数据副本；适配器应按 mapping 转换数据。修改传入副本不会改变组件预览。

方法 `reset()` 清空流程并中止当前任务。处理中禁止重复请求；抛出异常会显示错误并保留当前步骤供重试。取消、卸载以及替换 adapter/fields 会使旧结果失效。修改配置请替换引用，避免原地修改。

取消只能中止客户端等待，不能撤销服务端已经完成的写入；实际提交接口需处理幂等性和最终状态查询。类型、大小及校验结果仍须在服务端重新验证。组件不内置 CSV/XLSX 解析库、上传接口或持久化。

预览显示前 10 行原始数据，错误列表最多展示 100 项，错误总数仍按完整结果计算。大文件应由宿主限制规模或使用服务端解析。CSS Parts：`panel`、`preview`。
