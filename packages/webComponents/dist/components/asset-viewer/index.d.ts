import { LitElement } from 'lit';

type AssetType = 'image' | 'video' | 'audio' | 'pdf' | 'unknown';
export declare class SeAssetViewer extends LitElement {
    src: string;
    thumbnail: string;
    title: string;
    downloadable: boolean;
    type: AssetType;
    private previewVisible;
    static styles: import('lit').CSSResult[];
    private resolveType;
    private openPreview;
    private closePreview;
    private renderPreviewThumb;
    private renderOverlay;
    render(): import('lit').TemplateResult<1>;
}
export {};
