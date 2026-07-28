import { LitElement } from 'lit';

interface RadioOption {
    label: string;
    value: string;
    disabled?: boolean;
}
export declare class SuRadioGroup extends LitElement {
    static formAssociated: boolean;
    options: RadioOption[];
    optionsJson: string;
    value: string;
    name: string;
    disabled: boolean;
    private defaultValue;
    private readonly formValue;
    static styles: import('lit').CSSResult[];
    private get mergedOptions();
    private onChange;
    firstUpdated(): void;
    formResetCallback(): void;
    formStateRestoreCallback(state: string | File | FormData | null): void;
    focus(options?: FocusOptions): void;
    render(): import('lit').TemplateResult<1>;
}
export type { RadioOption };
