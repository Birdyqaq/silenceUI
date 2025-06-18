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
    static styles: import('lit').CSSResult;
    handleInput(event: Event): void;
    render(): import('lit').TemplateResult<1>;
}
export * from './index';
