import { LitElement } from 'lit';

interface Column {
    key: string;
    label: string;
    sortable?: boolean;
    filterable?: boolean;
    width?: string;
}
export declare class seTable extends LitElement {
    data: any[];
    columns: Column[];
    noDataText: string;
    borderStyle: string;
    rowLines: boolean;
    columnLines: boolean;
    theadBgColor: string;
    theadTextColor: string;
    pageSize: number;
    currentPage: number;
    sortedColumns: Column[];
    sortedData: any[];
    sortColumn: (index: number) => void;
    static styles: import('lit').CSSResult;
    constructor();
    willUpdate(changedProperties: Map<string | number | symbol, unknown>): void;
    get paginatedData(): any[];
    handlePageChange(event: Event): void;
    render(): import('lit').TemplateResult<1>;
}
export {};
