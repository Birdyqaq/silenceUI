import { ExportExcelOptions } from './types';

/**
 * 基于 xlsx-style，支持全部样式配置
 */
export declare function exportExcel(options: ExportExcelOptions | Blob | ArrayBuffer | string): void;
