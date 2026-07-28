import { LitElement } from 'lit';

interface SelectOption {
    label: string;
    value: string | number;
    disabled?: boolean;
}
export declare class SuSelect extends LitElement {
    static formAssociated: boolean;
    options: SelectOption[];
    optionsJson: string;
    value: string;
    name: string;
    placeholder: string;
    disabled: boolean;
    private defaultValue;
    private readonly formValue;
    static styles: import('lit').CSSResult[];
    private get mergedOptions();
    private handleChange;
    firstUpdated(): void;
    formResetCallback(): void;
    formStateRestoreCallback(state: string | File | FormData | null): void;
    focus(options?: FocusOptions): void;
    protected updated(): void;
    render(): import('lit').TemplateResult<1>;
}
export type { SelectOption };
