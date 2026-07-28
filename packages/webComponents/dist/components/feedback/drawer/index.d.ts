import { LitElement, nothing, PropertyValues } from 'lit';

export declare class SuDrawer extends LitElement {
    open: boolean;
    title: string;
    width: string;
    maskClosable: boolean;
    placement: 'left' | 'right';
    private overlayActive;
    private previouslyFocused;
    private onKeydown;
    connectedCallback(): void;
    disconnectedCallback(): void;
    static styles: import('lit').CSSResult[];
    willUpdate(): void;
    private close;
    private handleMaskClick;
    private activateOverlay;
    private deactivateOverlay;
    protected updated(changedProperties: PropertyValues<this>): void;
    render(): import('lit').TemplateResult<1> | typeof nothing;
}
