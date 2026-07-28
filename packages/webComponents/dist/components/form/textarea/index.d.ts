import { LitElement } from 'lit';

export declare class SuTextarea extends LitElement {
    static formAssociated: boolean;
    value: string;
    name: string;
    placeholder: string;
    rows: number;
    disabled: boolean;
    readonly: boolean;
    private defaultValue;
    private readonly formValue;
    static styles: import('lit').CSSResult[];
    private handleInput;
    firstUpdated(): void;
    formResetCallback(): void;
    formStateRestoreCallback(state: string | File | FormData | null): void;
    focus(options?: FocusOptions): void;
    render(): import('lit').TemplateResult<1>;
}
