import { LitElement } from 'lit';

export declare class SeImagePreview extends LitElement {
    src: string;
    alt: string;
    private rotation;
    private previouslyFocused;
    static styles: import('lit').CSSResult[];
    private onKeydown;
    connectedCallback(): void;
    disconnectedCallback(): void;
    firstUpdated(): void;
    private close;
    private closeByMask;
    private rotate;
    render(): import('lit').TemplateResult<1>;
}
/** @deprecated Use SeImagePreview. */
export { SeImagePreview as seImagePreview };
