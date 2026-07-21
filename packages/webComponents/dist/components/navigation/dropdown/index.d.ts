import { LitElement } from 'lit';

interface DropdownItem {
    key: string;
    label: string;
    disabled?: boolean;
    danger?: boolean;
}
export declare class SuDropdown extends LitElement {
    items: DropdownItem[];
    itemsJson: string;
    private open;
    static styles: import('lit').CSSResult[];
    private onDocumentClick;
    connectedCallback(): void;
    disconnectedCallback(): void;
    private get mergedItems();
    private toggle;
    private onSelect;
    render(): import('lit').TemplateResult<1>;
}
export type { DropdownItem };
