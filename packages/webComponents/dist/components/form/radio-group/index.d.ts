import { LitElement } from 'lit';

interface RadioOption {
    label: string;
    value: string;
    disabled?: boolean;
}
export declare class SuRadioGroup extends LitElement {
    options: RadioOption[];
    optionsJson: string;
    value: string;
    name: string;
    static styles: import('lit').CSSResult[];
    private get mergedOptions();
    private onChange;
    render(): import('lit').TemplateResult<1>;
}
export type { RadioOption };
