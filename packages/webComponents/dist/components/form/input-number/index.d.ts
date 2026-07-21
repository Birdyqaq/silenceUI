import { LitElement } from 'lit';

export declare class SuInputNumber extends LitElement {
    value: number;
    min: number;
    max: number;
    step: number;
    disabled: boolean;
    static styles: import('lit').CSSResult[];
    private clamp;
    private emitChange;
    private onInput;
    private onBlur;
    render(): import('lit').TemplateResult<1>;
}
