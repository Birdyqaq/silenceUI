<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

defineProps({ category: String });
const ready = ref(false);
const result = ref('操作组件可在这里查看事件结果');
const modal = ref(null);
const drawer = ref(null);
let disposed = false;
let api;
const transient = new Set();
const columns = [
  { key: 'name', label: '姓名', sortable: true },
  { key: 'age', label: '年龄', sortable: true },
];
const rows = [
  { id: 1, name: 'Alice', age: 24 },
  { id: 2, name: 'Bob', age: 28 },
  { id: 3, name: 'Cindy', age: 26 },
];
const choices = [
  { value: 'sh', label: '上海' },
  { value: 'bj', label: '北京' },
];
const menu = [
  { key: 'home', label: '工作台', icon: 'H' },
  { key: 'orders', label: '订单', icon: 'O' },
];

onMounted(async () => {
  api = await import('../../../index.ts');
  if (!disposed) ready.value = true;
});
onUnmounted(() => {
  disposed = true;
  transient.forEach((element) => element.remove());
});
function report(event) {
  result.value =
    event.type +
    ': ' +
    JSON.stringify(event.detail, (_, value) =>
      value instanceof File ? { name: value.name, size: value.size, type: value.type } : value
    );
}
function notify(kind) {
  const element =
    kind === 'message'
      ? api.message.success('保存成功')
      : api.notification.success('更新完成', '这是可运行的通知示例');
  transient.add(element);
  element.addEventListener('close', () => transient.delete(element), { once: true });
}
</script>

<template>
  <section class="component-demo" :aria-label="category + ' 组件交互演示'">
    <p v-if="!ready" role="status">正在加载组件…</p>
    <div v-else class="examples">
      <template v-if="category === 'data'">
        <su-card
          ><span slot="header">订单概况</span
          ><su-stat-card title="今日订单" value="128" trend="+12%" trendType="up" /><span
            slot="footer"
            >卡片底部插槽</span
          ></su-card
        >
        <div class="row">
          <su-tag type="success">已完成</su-tag><su-badge count="5"><span>通知</span></su-badge
          ><su-avatar name="👩‍💻" />
        </div>
        <su-descriptions
          header="订单信息"
          :items.prop="[
            { label: '订单号', value: 'SO-001' },
            { label: '状态', value: '已完成' },
          ]"
          bordered
        />
        <su-tree
          :nodes.prop="[
            { key: 'root', label: '研发中心', children: [{ key: 'frontend', label: '前端组' }] },
          ]"
          @select="report"
          @expand="report"
        />
        <su-empty description="暂无待处理任务" />
        <su-skeleton rows="2" />
      </template>
      <template v-else-if="category === 'table'">
        <se-table
          :columns.prop="columns"
          :data.prop="rows"
          :pageSize.prop="2"
          selectable
          @sort-change="report"
          @page-change="report"
          @selection-change="report"
        />
        <se-pagination :total.prop="50" :pageSize.prop="10" @page-change="report" />
      </template>
      <template v-else-if="category === 'navigation'">
        <su-menu :items.prop="menu" @select="report" />
        <su-breadcrumb
          :items.prop="[{ label: '首页', key: 'home' }, { label: '订单详情' }]"
          @navigate="report"
        />
        <su-tabs
          :items.prop="[
            { key: 'basic', label: '基本信息' },
            { key: 'logs', label: '操作日志' },
          ]"
          @change="report"
          ><div slot="basic">基本信息面板</div>
          <div slot="logs">操作日志面板</div></su-tabs
        >
        <su-dropdown
          :items.prop="[
            { key: 'edit', label: '编辑' },
            { key: 'copy', label: '复制' },
          ]"
          @select="report"
          ><su-button>打开操作菜单</su-button></su-dropdown
        >
        <su-steps
          :items.prop="[{ title: '填写资料' }, { title: '确认订单' }, { title: '完成' }]"
          :current.prop="1"
        />
      </template>
      <template v-else-if="category === 'feedback'">
        <div class="row">
          <su-button @click="modal.open = true">打开模态框</su-button
          ><su-button @click="drawer.open = true">打开抽屉</su-button
          ><su-button @click="notify('message')">显示消息</su-button
          ><su-button @click="notify('notification')">显示通知</su-button>
        </div>
        <su-modal ref="modal" title="删除确认" @confirm="report" @close="report"
          >这是一条可交互的确认信息。</su-modal
        >
        <su-drawer ref="drawer" title="订单详情" @close="report"
          >按 Escape 或点击遮罩关闭。</su-drawer
        >
        <su-alert type="warning" header="注意" closable @close="report"
          >这是可关闭的警告提示。</su-alert
        >
        <div class="row">
          <su-popconfirm title="确定执行吗？" @confirm="report" @cancel="report"
            ><su-button>气泡确认</su-button></su-popconfirm
          ><su-tooltip content="按 Escape 关闭提示"
            ><button type="button">聚焦查看提示</button></su-tooltip
          >
        </div>
        <su-spin tip="加载中" /><su-progress :percent.prop="60" />
      </template>
      <template v-else-if="category === 'layout'">
        <div class="container-preview">
          <su-container
            ><aside slot="sider">侧边栏</aside>
            <header slot="header">后台管理</header>
            <su-card>主体内容</su-card></su-container
          >
        </div>
        <su-divider dashed>章节分隔</su-divider>
        <div class="row"><span>切换演示主题</span><su-theme-toggle @change="report" /></div>
      </template>
      <template v-else-if="category === 'form'">
        <su-date-picker label="开始日期" value="2026-10-18" @change="report" />
        <su-cascader
          :options.prop="[{ value: 'cn', label: '中国', children: choices }]"
          @change="report"
        />
        <su-upload
          accept="image/*,.txt"
          :maxSize.prop="5242880"
          hint="仅在本地选择文件，不发送网络请求"
          @change="report"
          @reject="report"
        />
        <su-input-number :value.prop="0.2" :step.prop="0.1" @change="report" />
        <su-radio-group :options.prop="choices" @change="report" /><su-switch @change="report" />
        <su-textarea placeholder="输入备注" @input-change="report" />
      </template>
      <output aria-live="polite">{{ result }}</output>
    </div>
  </section>
</template>

<style scoped>
.component-demo {
  margin: 20px 0;
  padding: 18px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
}
.examples {
  display: grid;
  gap: 16px;
  min-width: 0;
}
.row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 16px;
}
output {
  padding: 10px;
  overflow-wrap: anywhere;
  background: var(--vp-c-bg-soft);
  font-size: 12px;
}
.container-preview {
  height: 260px;
  overflow: auto;
  border: 1px solid var(--vp-c-divider);
}
.container-preview su-container {
  display: block;
}
</style>
