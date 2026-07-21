import { LitElement } from 'lit';

interface StepItem {
    title: string;
    description?: string;
}
export declare class SuSteps extends LitElement {
    items: StepItem[];
    itemsJson: string;
    /** 当前步骤下标，从 0 开始 */
    current: number;
    static styles: import('lit').CSSResult[];
    private get mergedItems();
    render(): import('lit').TemplateResult<1>;
}
export type { StepItem };
