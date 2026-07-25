import { LitElement } from 'lit';

interface BreadcrumbItem {
    label: string;
    key?: string;
}
export declare class SuBreadcrumb extends LitElement {
    items: BreadcrumbItem[];
    itemsJson: string;
    separator: string;
    static styles: import('lit').CSSResult[];
    private get mergedItems();
    private handleClick;
    render(): import('lit').TemplateResult<1>;
}
export type { BreadcrumbItem };
