import { LitElement } from 'lit';

export declare class seImage extends LitElement {
    src: string;
    alt: string;
    lazy: boolean;
    placeholder: string;
    errorPlaceholder: string;
    width: Number;
    height: Number;
    private isError;
    private isPreviewVisible;
    private rotation;
    static styles: import('lit').CSSResult;
    private observer;
    firstUpdated(): void;
    loadImage(): void;
    handleError(): void;
    handleImageClick(): void;
    handleClosePreview(): void;
    handleRotate(): void;
    render(): import('lit').TemplateResult<1>;
}
