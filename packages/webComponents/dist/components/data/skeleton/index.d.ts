import { LitElement } from 'lit';

export declare class SuSkeleton extends LitElement {
    rows: number;
    avatar: boolean;
    animated: boolean;
    /** 为 false 时显示插槽中的真实内容 */
    loading: boolean;
    static styles: import('lit').CSSResult[];
    render(): import('lit').TemplateResult<1>;
}
