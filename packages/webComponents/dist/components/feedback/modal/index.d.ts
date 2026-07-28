import { LitElement, nothing, PropertyValues } from 'lit';

export declare class SuModal extends LitElement {
    open: boolean;
    title: string;
    maskClosable: boolean;
    hideFooter: boolean;
    confirmText: string;
    cancelText: string;
    private overlayActive;
    private previouslyFocused;
    private onKeydown;
    connectedCallback(): void;
    disconnectedCallback(): void;
    static styles: import('lit').CSSResult[];
    private closeByMask;
    private close;
    private confirm;
    private activateOverlay;
    private deactivateOverlay;
    protected updated(changedProperties: PropertyValues<this>): void;
    render(): import('lit').TemplateResult<1> | typeof nothing;
}
