import { LitElement } from 'lit';

export declare class SuStatCard extends LitElement {
    title: string;
    value: string;
    trend: string;
    trendType: 'up' | 'down' | 'flat';
    static styles: import('lit').CSSResult[];
    render(): import('lit').TemplateResult<1>;
}
