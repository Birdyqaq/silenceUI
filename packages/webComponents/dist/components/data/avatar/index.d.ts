import { LitElement } from 'lit';

export declare class SuAvatar extends LitElement {
    src: string;
    /** 图片加载失败或未提供 src 时，取 name 首字符作为占位 */
    name: string;
    size: 'small' | 'medium' | 'large';
    shape: 'circle' | 'square';
    private loadError;
    static styles: import('lit').CSSResult[];
    updated(changed: Map<string, unknown>): void;
    render(): import('lit').TemplateResult<1>;
}
