import { LitElement } from 'lit';

export declare class SuSwitch extends LitElement {
    static formAssociated: boolean;
    checked: boolean;
    disabled: boolean;
    name: string;
    value: string;
    private defaultChecked;
    private readonly formValue;
    static styles: import('lit').CSSResult[];
    private handleClick;
    firstUpdated(): void;
    formResetCallback(): void;
    formStateRestoreCallback(state: string | File | FormData | null): void;
    focus(options?: FocusOptions): void;
    render(): import('lit').TemplateResult<1>;
}
