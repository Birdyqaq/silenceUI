import { LitElement } from 'lit';

export declare class SuButton extends LitElement {
    static styles: import('lit').CSSResult;
    size: string;
    type: string;
    disabled: boolean;
    loading: boolean;
    iconClass: string;
    iconPosition: 'left' | 'right';
    rippleColor: string;
    ripple: boolean;
    block: boolean;
    round: boolean;
    private handleClick;
    render(): import('lit').TemplateResult<1>;
    private getButtonClasses;
    private renderSpinner;
    private renderIcon;
}
