import { LitElement } from 'lit';

export declare class SeInput extends LitElement {
    value: string;
    placeholder: string;
    disabled: boolean;
    type: string;
    readonly: boolean;
    error: boolean;
    label: string;
    helperText: string;
    clearable: boolean;
    static styles: import('lit').CSSResult[];
    private emitChange;
    private handleInput;
    private handleClear;
    render(): import('lit').TemplateResult<1>;
}
