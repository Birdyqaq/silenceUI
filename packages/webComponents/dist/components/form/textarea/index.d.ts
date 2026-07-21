import { LitElement } from 'lit';

export declare class SuTextarea extends LitElement {
    value: string;
    placeholder: string;
    rows: number;
    disabled: boolean;
    static styles: import('lit').CSSResult[];
    private handleInput;
    render(): import('lit').TemplateResult<1>;
}
