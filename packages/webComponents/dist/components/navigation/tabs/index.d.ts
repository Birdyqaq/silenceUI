import { LitElement } from 'lit';

interface TabItem {
    key: string;
    label: string;
    disabled?: boolean;
}
/**
 * 标签页。面板内容通过 slot 传入，slot 名与 tab 的 key 对应：
 * <su-tabs .items=${[{key:'a',label:'A'}]}><div slot="a">内容A</div></su-tabs>
 */
export declare class SuTabs extends LitElement {
    items: TabItem[];
    itemsJson: string;
    activeKey: string;
    static styles: import('lit').CSSResult[];
    private get mergedItems();
    private get currentKey();
    private onSelect;
    render(): import('lit').TemplateResult<1>;
}
export type { TabItem };
