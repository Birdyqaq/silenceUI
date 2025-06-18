import * as XLSX from 'xlsx';
import type { ExportExcelOptions, ExcelSheet } from './types';

/**
 * 基于 xlsx 社区版，支持基础样式、合并单元格、列宽、行高等
 */
export function exportExcel(options: ExportExcelOptions | Blob | ArrayBuffer | string) {
    // 1. Blob 直接下载
    if (options instanceof Blob) {
        const url = URL.createObjectURL(options);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'export.xlsx';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        return;
    }

    // 2. ArrayBuffer 直接下载
    if (options instanceof ArrayBuffer) {
        const blob = new Blob([options], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'export.xlsx';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        return;
    }

    // 3. 二进制字符串直接下载
    if (typeof options === 'string') {
        const buf = new ArrayBuffer(options.length);
        const view = new Uint8Array(buf);
        for (let i = 0; i < options.length; ++i) {
            view[i] = options.charCodeAt(i) & 0xff;
        }
        const blob = new Blob([buf], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'export.xlsx';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        return;
    }

    // 4. JSON 配置导出
    const wb = XLSX.utils.book_new();

    options.sheets.forEach((sheet: ExcelSheet) => {
        let ws = XLSX.utils.json_to_sheet(sheet.data, {
            header: sheet.columns?.map(col => col.key)
        });

        // 设置表头样式（仅社区版支持的部分）
        if (sheet.columns) {
            sheet.columns.forEach((col, idx) => {
                const cellRef = XLSX.utils.encode_cell({ r: 0, c: idx });
                if (!ws[cellRef]) ws[cellRef] = { t: 's', v: col.title };
                if (col.style) ws[cellRef].s = filterCommunityStyle(col.style);
            });
        }

        // 设置数据行样式和格式
        if (sheet.columns) {
            sheet.data.forEach((row, rowIdx) => {
                sheet.columns!.forEach((col, colIdx) => {
                    const cellRef = XLSX.utils.encode_cell({ r: rowIdx + 1, c: colIdx });
                    if (ws[cellRef]) {
                        if (col.style) ws[cellRef].s = filterCommunityStyle(col.style);
                        if (col.format) ws[cellRef].z = col.format;
                    }
                });
            });
        }

        // 合并单元格
        if ((sheet as any).merges) {
            ws['!merges'] = (sheet as any).merges;
        }
        // 列宽
        if ((sheet as any).cols) {
            ws['!cols'] = (sheet as any).cols;
        }
        // 行高
        if ((sheet as any).rows) {
            ws['!rows'] = (sheet as any).rows;
        }

        XLSX.utils.book_append_sheet(wb, ws, sheet.name);
    });

    XLSX.writeFile(wb, (options as any).fileName || 'export.xlsx');
}

/**
 * 仅保留 xlsx 社区版支持的样式
 */
function filterCommunityStyle(style: any) {
    const result: any = {};
    if (style.font) {
        result.font = {};
        if (style.font.bold) result.font.bold = true;
        if (style.font.italic) result.font.italic = true;
        if (style.font.underline) result.font.underline = true;
        if (style.font.sz) result.font.sz = style.font.sz;
        if (style.font.name) result.font.name = style.font.name;
    }
    if (style.alignment) {
        result.alignment = {};
        if (style.alignment.horizontal) result.alignment.horizontal = style.alignment.horizontal;
        if (style.alignment.vertical) result.alignment.vertical = style.alignment.vertical;
        if (style.alignment.wrapText) result.alignment.wrapText = style.alignment.wrapText;
    }
    return result;
}