# Upload 文件上传与附件管理

`su-upload` 用于选择、校验和提交本地文件。应用负责发送请求，可用 `uploads` 显示进度，并监听取消事件。保存成功后，用 `su-attachment-list` 展示服务端返回的附件。

<script setup>
import { ref } from 'vue';

const accept = ref('.png,.jpg,.jpeg,.pdf');
const maxMiB = ref(5);
const maxCount = ref(3);
const multiple = ref(true);
const report = ref('');
const attachments = ref([
  { id: 'handbook', name: '值班手册.pdf', description: '已保存 · 240 KB' },
]);

const rejectionReasons = { type: '类型不符合要求', size: '超过单文件大小上限', count: '超过数量上限' };
function showRejected(event) {
  report.value = event.detail.rejected.map(({ file, reason }) => file.name + '：' + rejectionReasons[reason]).join('；');
}
</script>

<ClientOnly>
  <div class="upload-settings">
    <label>类型规则 <input v-model="accept" /></label>
    <label>单文件上限（MiB） <input v-model.number="maxMiB" type="number" min="0" /></label>
    <label>多选数量上限 <input v-model.number="maxCount" type="number" min="0" /></label>
    <label><input v-model="multiple" type="checkbox" /> 允许多选</label>
  </div>
  <su-upload name="attachments" label="选择文件或拖到这里"
    :accept.prop="accept" :maxSize.prop="Math.max(0, Number(maxMiB) || 0) * 1048576"
    :maxCount.prop="Math.max(0, Number(maxCount) || 0)" :multiple.prop="multiple"
    @change="report = ''" @reject="showRejected"></su-upload>
  <p role="status">{{ report }}</p>
  <su-attachment-list :items.prop="attachments" removable
    @attachment-open="report = '应用收到打开请求：' + $event.detail.item.name"
    @attachment-remove="attachments = attachments.filter(item => item.id !== $event.detail.item.id)"></su-attachment-list>
</ClientOnly>

<style scoped>
.upload-settings { display: flex; align-items: center; flex-wrap: wrap; gap: 8px 16px; margin-block: 12px; }
.upload-settings input:not([type="checkbox"]) { padding: 3px 6px; border: 1px solid var(--vp-c-divider); border-radius: 4px; max-width: 11rem; }
.upload-settings input[type="number"] { width: 4.5rem; }
</style>

## 配置文件限制

```html
<su-upload
  name="attachments"
  accept=".png,.jpg,.jpeg,.pdf"
  max-size="5242880"
  max-count="3"
  multiple
></su-upload>
```

| HTML 属性   | JS property | 规则                                                                                                   |
| ----------- | ----------- | ------------------------------------------------------------------------------------------------------ |
| `accept`    | `accept`    | 逗号分隔的扩展名、MIME 类型或类型通配规则，例如 `.pdf,application/pdf,image/*`。匹配其中任一规则即可。 |
| `max-size`  | `maxSize`   | 单个文件的字节上限。5 MiB 等于 5,242,880 字节。                                                        |
| `max-count` | `maxCount`  | 一次多选可接受的最大数量。                                                                             |
| `multiple`  | `multiple`  | 布尔开关，关闭时最多接受一个文件。                                                                     |

`maxSize` 和 `maxCount` 默认为 0，表示对应规则不设上限。每次选择或拖入会替换当前待提交文件。校验拒绝通过 `reject.detail.rejected` 返回，每项带 `file` 和 `reason`，原因包括 `type`、`size`、`count`。服务端应独立校验实际文件内容、大小和权限。

## 上传与已保存附件

按需入口是 `silenceui/components/form/upload` 和 `silenceui/components/data/attachment-list`。原生表单可通过 `FormData` 取得当前选中的文件。进度和取消接口见 [Upload 进度与取消](./form#upload-进度与取消)。

`su-attachment-list.items` 接收 `readonly AttachmentListItem[]`，每项包含唯一 `id`、`name` 和可选的 `description`。通过 `removable` 显示移除按钮，`disabled` 禁用操作，`label` 设置可访问名称。

| 事件                | `detail`   | 宿主操作                                     |
| ------------------- | ---------- | -------------------------------------------- |
| `attachment-open`   | `{ item }` | 按附件 ID 获取访问地址，交给预览或下载流程。 |
| `attachment-remove` | `{ item }` | 保存移除结果后替换列表数据。                 |

示例的打开操作会显示收到的请求。应用可将地址交给 [AssetViewer 资源预览](./asset-viewer)。
