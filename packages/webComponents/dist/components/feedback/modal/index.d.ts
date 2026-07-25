import { LitElement, nothing } from 'lit';

export declare class SuModal extends LitElement {
    open: boolean;
    title: string;
    maskClosable: boolean;
    hideFooter: boolean;
    confirmText: string;
    cancelText: string;
    private onKeydown;
    connectedCallback(): void;
    disconnectedCallback(): void;
    static styles: import('lit').CSSResult[];
    private closeByMask;
    private close;
    private confirm;
    render(): import('lit').TemplateResult<1> | typeof nothing;
}
