import { LitElement } from 'lit';

interface SelectOption {
    label: string;
    value: string | number;
    disabled?: boolean;
}
export declare class SuSelect extends LitElement {
    options: SelectOption[];
    optionsJson: string;
    value: string;
    placeholder: string;
    disabled: boolean;
    static styles: import('lit').CSSResult[];
    private get mergedOptions();
    private handleChange;
    render(): import('lit').TemplateResult<1>;
}
export type { SelectOption };
