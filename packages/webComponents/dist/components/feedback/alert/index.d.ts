import { LitElement, nothing } from 'lit';

type AlertType = 'info' | 'success' | 'warning' | 'error';
export declare class SuAlert extends LitElement {
    type: AlertType;
    header: string;
    closable: boolean;
    showIcon: boolean;
    private closed;
    static styles: import('lit').CSSResult[];
    private handleClose;
    render(): import('lit').TemplateResult<1> | typeof nothing;
}
export type { AlertType };
