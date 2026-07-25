import { LitElement } from 'lit';

interface MenuItem {
    key: string;
    label: string;
    icon?: string;
}
export declare class SuMenu extends LitElement {
    items: MenuItem[];
    itemsJson: string;
    activeKey: string;
    collapsed: boolean;
    static styles: import('lit').CSSResult[];
    private get mergedItems();
    private onSelect;
    render(): import('lit').TemplateResult<1>;
}
export type { MenuItem };
