import { LitElement } from 'lit';

export declare class SuBadge extends LitElement {
    count: number;
    max: number;
    dot: boolean;
    showZero: boolean;
    static styles: import('lit').CSSResult[];
    private get text();
    render(): import('lit').TemplateResult<1>;
}
