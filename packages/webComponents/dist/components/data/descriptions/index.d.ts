import { LitElement } from 'lit';

interface DescriptionItem {
    label: string;
    value: string;
}
export declare class SuDescriptions extends LitElement {
    items: DescriptionItem[];
    itemsJson: string;
    header: string;
    column: number;
    bordered: boolean;
    static styles: import('lit').CSSResult[];
    willUpdate(): void;
    private get mergedItems();
    render(): import('lit').TemplateResult<1>;
}
export type { DescriptionItem };
