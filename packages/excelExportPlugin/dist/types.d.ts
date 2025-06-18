/** 单元格样式类型，参考 SheetJS 样式文档 */
export interface ExcelCellStyle {
    font?: {
        name?: string;
        sz?: number;
        bold?: boolean;
        italic?: boolean;
        underline?: boolean;
        color?: {
            rgb: string;
        };
    };
    alignment?: {
        horizontal?: 'left' | 'center' | 'right';
        vertical?: 'top' | 'center' | 'bottom';
        wrapText?: boolean;
    };
    fill?: {
        fgColor?: {
            rgb: string;
        };
        bgColor?: {
            rgb: string;
        };
    };
    border?: any;
}
/** 列配置 */
export interface ExcelColumn {
    key: string;
    title: string;
    style?: ExcelCellStyle;
    format?: string;
    type?: 'string' | 'number' | 'date' | 'image';
}
/** 单个 sheet 配置 */
export interface ExcelSheet {
    name: string;
    data: Record<string, any>[];
    columns?: ExcelColumn[];
}
/** 导出参数 */
export interface ExportExcelOptions {
    sheets: ExcelSheet[];
    fileName: string;
}
