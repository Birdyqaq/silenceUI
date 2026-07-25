import { LitElement } from 'lit';

export declare class SePagination extends LitElement {
    currentPage: number;
    total: number;
    pageSize: number;
    static styles: import('lit').CSSResult;
    private get totalPages();
    private clampPage;
    private emitChange;
    private handlePageInput;
    private handlePrevPage;
    private handleNextPage;
    render(): import('lit').TemplateResult<1>;
}
