# 组件总览

面向后台管理系统的 Web Components 组件集合。

## 表单

- `su-input` 输入框
- `su-input-number` 数字输入框
- `su-select` 选择器
- `su-textarea` 多行输入
- `su-checkbox` 复选框
- `su-radio-group` 单选组
- `su-switch` 开关
- `su-form-item` 表单项容器

## 数据展示

- `se-table` 表格（排序/分页/虚拟滚动/无限加载）
- `se-pagination` 分页
- `su-card` 卡片容器
- `su-stat-card` 指标卡片
- `su-tag` 状态标签
- `su-badge` 徽标数
- `su-avatar` 头像
- `su-empty` 空状态
- `su-skeleton` 骨架屏
- `su-descriptions` 描述列表（详情页字段展示）
- `se-image` 图片预览
- `se-asset-viewer` 资源预览卡

## 导航

- `su-menu` 菜单
- `su-breadcrumb` 面包屑
- `su-tabs` 标签页
- `su-dropdown` 下拉菜单
- `su-steps` 步骤条

## 反馈

- `su-modal` 模态框
- `su-drawer` 抽屉
- `su-alert` 警告提示
- `su-message` 全局消息（支持 `message.success('...')` 命令式调用）
- `su-tooltip` 文字提示
- `su-spin` 加载中
- `su-progress` 进度条

## 布局

- `su-container` 后台布局容器（`sider/header/content`）
- `su-divider` 分割线
- `su-theme-toggle` 一键明暗主题切换按钮

## 主题 API

从包入口导出，支持自定义颜色与持久化：

```ts
import { toggleThemeMode, setThemeMode, setThemeColors, resetThemeColors } from 'webcomponents';

toggleThemeMode();                       // 明暗一键切换
setThemeColors({ primary: '#7c3aed' }); // 自定义品牌色，自动派生 hover 色
```
