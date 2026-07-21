import { LitElement } from 'lit';

export declare class SuTag extends LitElement {
    type: 'default' | 'primary' | 'success' | 'warning' | 'error';
    static styles: import('lit').CSSResult[];
    render(): import('lit').TemplateResult<1>;
}
