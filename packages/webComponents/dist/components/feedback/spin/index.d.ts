import { LitElement, nothing } from 'lit';

export declare class SuSpin extends LitElement {
    /** 为 false 时直接显示插槽内容，不显示遮罩 */
    spinning: boolean;
    size: 'small' | 'medium' | 'large';
    tip: string;
    static styles: import('lit').CSSResult[];
    private renderIndicator;
    render(): import('lit').TemplateResult<1> | typeof nothing;
}
