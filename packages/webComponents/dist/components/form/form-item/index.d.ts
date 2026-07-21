import { LitElement } from 'lit';

export declare class SuFormItem extends LitElement {
    label: string;
    message: string;
    status: 'default' | 'error' | 'warning' | 'success';
    required: boolean;
    static styles: import('lit').CSSResult[];
    render(): import('lit').TemplateResult<1>;
}
