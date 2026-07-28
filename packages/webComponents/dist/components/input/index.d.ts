import { LitElement } from 'lit';

export declare class SuInput extends LitElement {
    static formAssociated: boolean;
    value: string;
    name: string;
    placeholder: string;
    disabled: boolean;
    type: string;
    readonly: boolean;
    error: boolean;
    label: string;
    helperText: string;
    clearable: boolean;
    private defaultValue;
    private readonly formValue;
    static styles: import('lit').CSSResult[];
    private emitChange;
    private handleInput;
    private handleClear;
    firstUpdated(): void;
    formResetCallback(): void;
    formStateRestoreCallback(state: string | File | FormData | null): void;
    focus(options?: FocusOptions): void;
    render(): import('lit').TemplateResult<1>;
}
/** @deprecated Use SuInput. */
export { SuInput as SeInput };
