import { LitElement } from 'lit';

export type ImageFit = 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
export declare class SeImage extends LitElement {
    src: string;
    alt: string;
    lazy: boolean;
    placeholder: string;
    errorPlaceholder: string;
    width: number;
    height: number;
    fit: ImageFit;
    preview: boolean;
    private isError;
    private isLoaded;
    private isPreviewVisible;
    static styles: import('lit').CSSResult[];
    protected willUpdate(changedProperties: Map<PropertyKey, unknown>): void;
    private get displaySrc();
    private handleLoad;
    private handleError;
    private openPreview;
    private closePreview;
    private renderImage;
    render(): import('lit').TemplateResult<1>;
}
/** @deprecated Use SeImage. */
export { SeImage as seImage };
