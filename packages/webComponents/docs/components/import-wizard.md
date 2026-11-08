# ImportWizard 导入向导

`su-import-wizard` 提供选择文件、字段映射、校验预览、确认导入和结果展示。文件解析、业务校验与服务端写入通过适配器提供。

<script setup>
import { ref } from 'vue';

const fields = [{ key: 'name', label: '姓名', required: true }, { key: 'team', label: '部门' }];
const sample = 'name\tteam\n张三\t研发\n李四\t运营\n';
const invalidSample = sample + '\t客服\n';
const download = (text) => 'data:text/tab-separated-values;charset=utf-8,' + encodeURIComponent(text);
const wizard = ref(null);
const state = ref({ step: 'file', operation: null, rowCount: 0, issueCount: 0 });
const stepLabels = { file: '选择文件', mapping: '字段映射', preview: '校验预览', result: '导入结果' };
const operationLabels = { parse: '解析中', validate: '校验中', submit: '提交中' };

function loadSample(text, name) {
  void wizard.value?.loadFile(new File([text], name, { type: 'text/tab-separated-values' }));
}

const adapter = {
  async parse(file, signal) {
    const text = await file.text();
    signal.throwIfAborted();
    const rows = text.replace(/^\uFEFF/, '').replace(/(?:\r?\n)+$/, '')
      .split(/\r?\n/).map(line => line.split('\t'));
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

点击「载入样例」可通过宿主 API 直接启动导入，也可以下载样例后从组件内选择文件。该示例解析 UTF-8 TSV，首行为列名，字段间使用 Tab 分隔。演示解析器仅支持简单 TSV。

```text
name	team
张三	研发
李四	运营
```

<ClientOnly>
<p class="import-demo-actions">
  <button type="button" :disabled="state.step !== 'file' || !!state.operation"
    @click="loadSample(sample, '成员导入.tsv')">载入样例</button>
  <button type="button" :disabled="state.step !== 'file' || !!state.operation"
    @click="loadSample(invalidSample, '成员导入-缺少姓名.tsv')">载入含错误的样例</button>
</p>
<p>
  <a :href="download(sample)" download="成员导入.tsv">下载可导入样例</a> ·
  <a :href="download(invalidSample)" download="成员导入-缺少姓名.tsv">下载含错误行的样例</a>
</p>
<p>宿主状态：{{ stepLabels[state.step] }}{{ state.operation ? ' · ' + operationLabels[state.operation] : '' }}
  <template v-if="state.rowCount"> · {{ state.rowCount }} 行，{{ state.issueCount }} 项校验错误</template>
</p>
<su-import-wizard ref="wizard" :adapter.prop="adapter" :fields.prop="fields" accept=".tsv" :maxSize.prop="1048576"
  @import-state-change="state = $event.detail" />
</ClientOnly>

<style scoped>
.import-demo-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.import-demo-actions button {
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  padding: 6px 12px;
}
.import-demo-actions button:disabled {
  opacity: .5;
}
</style>

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

### 宿主控制 API

| 方法或事件                         | 行为                                                                                                                                                                                 |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `loadFile(file): Promise<boolean>` | 从组件外传入 `File`。组件需已挂载并配置，且处于空闲的文件选择步骤。复用文件类型、大小和解析检查。进入映射时返回 `true`。校验不通过、解析失败、取消或当前无法接收文件时返回 `false`。 |
| `getState(): ImportWizardState`    | 读取当前状态的独立快照。                                                                                                                                                             |
| `cancel(): boolean`                | 取消正在进行的解析、校验或提交，保留当前步骤和已有数据。空闲时返回 `false`。                                                                                                         |
| `reset(): void`                    | 清空流程，取消当前操作并回到文件选择。                                                                                                                                               |
| `import-state-change`              | 首次渲染及渲染后快照变化时派发。事件会冒泡并穿过 Shadow DOM，`detail` 为独立状态快照。同一次渲染中的变化会合并。                                                                     |

状态快照包含 `step`（`file`、`mapping`、`preview` 或 `result`）、`operation`（`parse`、`validate`、`submit` 或空闲时的 `null`）、最近尝试的 `fileName`、`rowCount`、`issueCount` 和操作失败文案 `error`。错误条数是校验问题数量，文件内容及校验问题明细不随状态事件发送。

处理中拒绝重复操作。适配器抛出异常时，界面显示错误并保留当前步骤供重试。取消、卸载以及替换 `adapter` 或 `fields` 都会使旧结果失效。修改配置请替换引用，避免原地修改。

重新开始后，上一轮已移除的字段映射控件事件不会修改新文件的映射；配置替换后、界面尚未更新时也不接收旧映射事件。

取消只能中止客户端等待，不能撤销服务端已经完成的写入；实际提交接口需处理幂等性和最终状态查询。类型、大小及校验结果仍须在服务端重新验证。组件不内置 CSV/XLSX 解析库、上传接口或持久化。

预览按目标字段顺序展示已映射列，并保留源数据行号。默认预览前 10 行。勾选「只看错误行」后，显示前 10 个有错误的源数据行，即使它们在原预览范围之外。一个数据行可以有多项错误。列表最多展示前 100 项错误，统计仍按完整校验结果计算。

大文件应由宿主限制规模或使用服务端解析。CSS Parts 为 `panel` 和 `preview`。
