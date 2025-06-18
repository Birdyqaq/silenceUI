import { LitElement } from 'lit';

export declare class LineComponent extends LitElement {
    direction: 'horizontal' | 'vertical';
    color: string;
    static styles: import('lit').CSSResult;
    render(): import('lit').TemplateResult<1>;
}
