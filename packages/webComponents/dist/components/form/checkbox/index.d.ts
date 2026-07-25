import { LitElement } from 'lit';

export declare class SuCheckbox extends LitElement {
    checked: boolean;
    disabled: boolean;
    label: string;
    static styles: import('lit').CSSResult[];
    private onChange;
    render(): import('lit').TemplateResult<1>;
}
