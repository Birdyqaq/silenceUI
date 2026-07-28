import { LitElement } from 'lit';

export declare class SuInputNumber extends LitElement {
    static formAssociated: boolean;
    value: number;
    name: string;
    min: number;
    max: number;
    step: number;
    disabled: boolean;
    private defaultValue;
    private readonly formValue;
    static styles: import('lit').CSSResult[];
    private clamp;
    private get safeStep();
    private emitChange;
    private onInput;
    private onBlur;
    firstUpdated(): void;
    formResetCallback(): void;
    formStateRestoreCallback(state: string | File | FormData | null): void;
    focus(options?: FocusOptions): void;
    render(): import('lit').TemplateResult<1>;
}
