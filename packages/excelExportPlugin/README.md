# excelExportPlugin

A lightweight and flexible plugin for exporting data to Excel files, based on [SheetJS (xlsx)](https://github.com/SheetJS/sheetjs).  
一个基于 SheetJS (xlsx) 的轻量级、灵活的 Excel 导出插件。

---

## Features / 功能

- **导出数组或 Blob 数据**：支持结构化数据或二进制数据导出
- **多 sheet 导出**：一个文件可包含多个工作表
- **自定义表头与列顺序**
- **单元格样式支持**：如字体、颜色、对齐、填充等
- **数据格式化**：如数字、日期格式
- **文件名自定义**
- **跨浏览器支持**

---

## Installation / 安装

```bash
npm install xlsx excel-export-plugin
```

---

## Usage / 使用方法

### 多 sheet 导出与样式示例

```typescript
import { exportExcel } from 'excel-export-plugin';

exportExcel({
  sheets: [
    {
      name: '成绩表',
      data: [
        { 姓名: '张三', 分数: 90 },
        { 姓名: '李四', 分数: 80 }
      ],
      columns: [
        { key: '姓名', title: '姓名' },
        { key: '分数', title: '分数', style: { font: { bold: true }, alignment: { horizontal: 'center' } }, format: '0.00' }
      ]
    },
    {
      name: '统计',
      data: [
        { 项目: '平均分', 值: 85 }
      ],
      columns: [
        { key: '项目', title: '项目' },
        { key: '值', title: '值', format: '0.00' }
      ]
    }
  ],
  fileName: 'report.xlsx'
});
```

---

## API Reference / API 参考

### `exportExcel(options)`

#### 参数说明

- `sheets`：数组，每个元素为一个 sheet 配置对象
  - `name`：sheet 名称
  - `data`：数据数组
  - `columns`：列配置（可选），支持 `key`、`title`、`style`、`format`
- `fileName`：导出文件名

#### 样式与格式化支持

- `columns[].style`：单元格样式（如 `{ font: { bold: true }, alignment: { horizontal: 'center' } }`）
- `columns[].format`：单元格格式化（如 `'0.00'`、`'yyyy-mm-dd'`）

---

## Advanced / 高级用法

- **合并单元格**、**动态表头**、**自定义样式**等高级功能可参考 [SheetJS 官方文档](https://docs.sheetjs.com/docs/csf/features#cell-styles)。
- **图片导出**：如需插入图片，请参考 SheetJS Pro 相关文档。

---

## 本地开发与测试

1. 克隆仓库并安装依赖
   ```bash
   git clone <your-repo-url>
   cd silenceUI/packages/excelExportPlugin
   npm install
   ```
2. 本地构建
   ```bash
   npm run build
   ```
3. 在其他项目中通过 `npm link` 或 `file:` 依赖方式集成本地包进行联调测试。

---

## License / 许可证

MIT License. See [LICENSE](./LICENSE) for details.
MIT 许可证。详情请参阅 [LICENSE](./LICENSE)。