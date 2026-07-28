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
    open: boolean;
    disabled: boolean;
    private triggerNeedsTabStop;
    private readonly menuId;
    private triggerElement;
    static styles: import('lit').CSSResult[];
    private onDocumentClick;
    connectedCallback(): void;
    disconnectedCallback(): void;
    private get mergedItems();
    private updateTriggerAria;
    private onSlotChange;
    private openMenu;
    private toggle;
    private focusTrigger;
    private onTriggerKeyDown;
    private onMenuKeyDown;
    private onSelect;
    updated(changedProperties: Map<PropertyKey, unknown>): void;
    render(): import('lit').TemplateResult<1>;
}
export type { DropdownItem };
