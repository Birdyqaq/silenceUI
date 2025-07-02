# 组件总览

SilenceUI 提供了丰富的组件库，涵盖了常见的 UI 需求。

## 基础组件

<div class="component-grid">
  <div class="component-card">
    <h3>Button 按钮</h3>
    <p>常用的操作按钮，支持多种类型和状态</p>
    <a href="./button" class="card-link">查看详情 →</a>
  </div>

  <div class="component-card">
    <h3>Input 输入框</h3>
    <p>基础表单输入组件，支持多种验证和交互</p>
    <a href="./input" class="card-link">查看详情 →</a>
  </div>

  <div class="component-card">
    <h3>Table 表格</h3>
    <p>功能强大的数据表格组件，支持排序、筛选等</p>
    <a href="./table" class="card-link">查看详情 →</a>
  </div>

  <div class="component-card">
    <h3>Image 图片</h3>
    <p>增强的图片组件，支持懒加载、预览等功能</p>
    <a href="./image" class="card-link">查看详情 →</a>
  </div>
</div>

## 快速开始

所有组件都基于 Web Components 标准，可以在任何前端项目中使用：

```html
<!-- 在 HTML 中直接使用 -->
<su-button type="primary">点击我</su-button>
<su-input placeholder="请输入内容"></su-input>
```

```javascript
// 在 JavaScript 中使用
import 'webcomponents/lib/index.js'

// 或按需引入
import 'webcomponents/lib/button/index.js'
```

<style scoped>
.component-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
  margin: 32px 0;
}

.component-card {
  border: 1px solid var(--vp-c-border);
  border-radius: 12px;
  padding: 24px;
  transition: all 0.3s ease;
}

.component-card:hover {
  border-color: var(--vp-c-brand);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.component-card h3 {
  margin: 0 0 12px 0;
  color: var(--vp-c-text-1);
  font-size: 18px;
}

.component-card p {
  margin: 0 0 16px 0;
  color: var(--vp-c-text-2);
  line-height: 1.6;
}

.card-link {
  color: var(--vp-c-brand);
  text-decoration: none;
  font-weight: 500;
}

.card-link:hover {
  text-decoration: underline;
}
</style>
