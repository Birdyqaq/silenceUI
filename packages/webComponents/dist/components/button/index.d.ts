import { LitElement } from 'lit';

export declare class SeButton extends LitElement {
    static styles: import('lit').CSSResult;
    size: 'small' | 'medium' | 'large';
    type: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' | 'light' | 'dark' | 'link';
    disabled: boolean;
    loading: boolean;
    iconClass: string;
    iconPosition: 'left' | 'right';
    rippleColor: string;
    private handleClick;
    render(): import('lit').TemplateResult<1>;
    private getButtonClasses;
    private getSizeClasses;
    private getTypeClasses;
    private renderSpinner;
    private renderIcon;
}
export * from './index';
