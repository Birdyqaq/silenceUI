import { LitElement, nothing } from 'lit';

export declare class SuDrawer extends LitElement {
    open: boolean;
    title: string;
    width: string;
    maskClosable: boolean;
    placement: 'left' | 'right';
    private onKeydown;
    connectedCallback(): void;
    disconnectedCallback(): void;
    static styles: import('lit').CSSResult[];
    willUpdate(): void;
    private close;
    private handleMaskClick;
    render(): import('lit').TemplateResult<1> | typeof nothing;
}
