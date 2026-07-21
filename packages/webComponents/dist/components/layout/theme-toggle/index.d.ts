import { LitElement } from 'lit';

/** 一键明暗主题切换按钮，多个实例之间通过 su-theme-change 事件保持同步 */
export declare class SuThemeToggle extends LitElement {
    private mode;
    static styles: import('lit').CSSResult[];
    private onThemeChange;
    connectedCallback(): void;
    disconnectedCallback(): void;
    private handleClick;
    render(): import('lit').TemplateResult<1>;
}
