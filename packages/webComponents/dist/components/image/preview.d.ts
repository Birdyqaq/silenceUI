import { LitElement } from 'lit';

export declare class seImagePreview extends LitElement {
    src: string;
    private rotation;
    static styles: import('lit').CSSResult;
    handleClose(): void;
    handleRotate(): void;
    render(): import('lit').TemplateResult<1>;
}
