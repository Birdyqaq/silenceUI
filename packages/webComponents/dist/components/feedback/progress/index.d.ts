import { LitElement } from 'lit';

export declare class SuProgress extends LitElement {
    percent: number;
    status: 'normal' | 'success' | 'error';
    showText: boolean;
    strokeHeight: string;
    static styles: import('lit').CSSResult[];
    willUpdate(): void;
    private get clampedPercent();
    render(): import('lit').TemplateResult<1>;
}
