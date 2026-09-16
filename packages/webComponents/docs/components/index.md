# 组件总览

SilenceUI 组件围绕后台管理系统组织，应用入口建议同时引入 `webcomponents/style.css` 与 `webcomponents`。新组件使用 `su-` 前缀，历史兼容组件保留 `se-` 前缀。

## 命名

| 前缀  | 说明               | 组件                                                       |
| ----- | ------------------ | ---------------------------------------------------------- |
| `su-` | 当前组件库标准前缀 | `su-button`、`su-input`、`su-modal` 等                     |
| `se-` | 历史兼容前缀       | `se-table`、`se-pagination`、`se-image`、`se-asset-viewer` |

## 表单

| 组件        | 标签              | 说明                                       | 主要事件           |
| ----------- | ----------------- | ------------------------------------------ | ------------------ |
| Input       | `su-input`        | 文本输入，支持标签、辅助文案、错误态和清空 | `input-change`     |
| DatePicker  | `su-date-picker`  | 日期选择，支持边界与原生表单               | `change`           |
| Cascader    | `su-cascader`     | 层级选项级联选择                           | `change`           |
| Upload      | `su-upload`       | 文件选择，支持类型、大小和数量校验         | `change`、`reject` |
| InputNumber | `su-input-number` | 数字输入，支持 `min/max/step`              | `change`           |
| Select      | `su-select`       | 原生选择器封装，支持 `options/optionsJson` | `change`           |
| Textarea    | `su-textarea`     | 多行文本输入                               | `input-change`     |
| Checkbox    | `su-checkbox`     | 单个复选框                                 | `change`           |
| RadioGroup  | `su-radio-group`  | 单选组，支持 `options/optionsJson`         | `change`           |
| Switch      | `su-switch`       | 开关                                       | `change`           |
| FormItem    | `su-form-item`    | 表单项容器、标签和校验信息                 | -                  |

## 数据展示

| 组件         | 标签              | 说明                                           | 主要事件                                                                   |
| ------------ | ----------------- | ---------------------------------------------- | -------------------------------------------------------------------------- |
| Table        | `se-table`        | 表格，支持排序、分页、选择、无限滚动和虚拟滚动 | `sort-change`、`page-change`、`row-click`、`selection-change`、`load-more` |
| Pagination   | `se-pagination`   | 独立分页控件                                   | `page-change`                                                              |
| Card         | `su-card`         | 卡片容器，支持 header/footer 插槽              | -                                                                          |
| StatCard     | `su-stat-card`    | 指标卡片                                       | -                                                                          |
| Tag          | `su-tag`          | 语义状态标签                                   | -                                                                          |
| Badge        | `su-badge`        | 数字徽标或红点                                 | -                                                                          |
| Avatar       | `su-avatar`       | 头像，图片失败时显示首字母                     | -                                                                          |
| Empty        | `su-empty`        | 空状态                                         | -                                                                          |
| Skeleton     | `su-skeleton`     | 骨架屏，可包裹真实内容                         | -                                                                          |
| Descriptions | `su-descriptions` | 详情页描述列表，支持 `items/itemsJson`         | -                                                                          |
| Tree         | `su-tree`         | 树形层级数据，支持展开与键盘导航               | `select`、`expand`                                                         |
| Image        | `se-image`        | 图片懒加载、错误占位和预览                     | `close`                                                                    |
| AssetViewer  | `se-asset-viewer` | 图片、视频、音频、PDF 资源预览                 | `asset-open`                                                               |

## 导航

| 组件       | 标签            | 说明                             | 主要事件   |
| ---------- | --------------- | -------------------------------- | ---------- |
| Menu       | `su-menu`       | 侧边栏菜单，支持收起             | `select`   |
| Breadcrumb | `su-breadcrumb` | 面包屑                           | `navigate` |
| Tabs       | `su-tabs`       | 标签页，面板 slot 名对应 tab key | `change`   |
| Dropdown   | `su-dropdown`   | 下拉操作菜单                     | `select`   |
| Steps      | `su-steps`      | 步骤条                           | -          |

## 反馈

| 组件         | 标签 / API                         | 说明                                         | 主要事件                     |
| ------------ | ---------------------------------- | -------------------------------------------- | ---------------------------- |
| Modal        | `su-modal`                         | 模态框，支持确认、取消、遮罩关闭和自定义底部 | `confirm`、`close`           |
| Drawer       | `su-drawer`                        | 抽屉，支持左右方向                           | `close`                      |
| Alert        | `su-alert`                         | 页面内警告提示                               | `close`                      |
| Message      | `message` / `su-message`           | 命令式全局消息                               | `close`                      |
| Notification | `notification` / `su-notification` | 右上角堆叠通知                               | `close`                      |
| Popconfirm   | `su-popconfirm`                    | 危险操作二次确认                             | `confirm`、`cancel`、`close` |
| Tooltip      | `su-tooltip`                       | 悬停或聚焦提示                               | -                            |
| Spin         | `su-spin`                          | 独立加载或区域遮罩                           | -                            |
| Progress     | `su-progress`                      | 线性进度条                                   | -                            |

## 布局

| 组件        | 标签              | 说明                                   |
| ----------- | ----------------- | -------------------------------------- |
| Container   | `su-container`    | 经典后台「侧边栏 + 顶栏 + 内容区」布局 |
| Divider     | `su-divider`      | 水平/垂直分割线                        |
| ThemeToggle | `su-theme-toggle` | 一键明暗主题切换                       |

## 主题 API

```ts
import {
  getThemeMode,
  message,
  notification,
  resetThemeColors,
  setThemeColors,
  setThemeMode,
  toggleThemeMode,
} from 'webcomponents';

toggleThemeMode();
setThemeColors({ primary: '#2563eb' });
message.success('保存成功');
notification.success('发布成功', '版本已上线');
```

属性、事件和复杂数据传参规则见 [API 约定](/guide/api-conventions)。
