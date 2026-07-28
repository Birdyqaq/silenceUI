import { LitElement } from 'lit';
import { ButtonIconPosition, ButtonSize, ButtonType } from './type';

export declare class SuButton extends LitElement {
    static styles: import('lit').CSSResult[];
    size: ButtonSize;
    type: ButtonType;
    disabled: boolean;
    loading: boolean;
    iconClass: string;
    iconPosition: ButtonIconPosition;
    rippleColor: string;
    ripple: boolean;
    block: boolean;
    round: boolean;
    /** 原生 button 的 type，表单场景可设为 submit / reset */
    nativeType: 'button' | 'submit' | 'reset';
    static get observedAttributes(): string[];
    attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void;
    private get isInactive();
    private get resolvedNativeType();
    private handleClick;
    private renderIcon;
    render(): import('lit').TemplateResult<1>;
}
export type { ButtonIconPosition, ButtonSize, ButtonType } from './type';
