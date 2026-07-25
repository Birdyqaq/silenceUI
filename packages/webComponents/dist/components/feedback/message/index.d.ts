import { LitElement } from 'lit';

type MessageType = 'info' | 'success' | 'warning' | 'error';
export declare class SuMessage extends LitElement {
    type: MessageType;
    duration: number;
    static styles: import('lit').CSSResult[];
    firstUpdated(): void;
    dismiss(): void;
    render(): import('lit').TemplateResult<1>;
}
interface MessageOptions {
    type?: MessageType;
    duration?: number;
}
/** 命令式消息提示：message('保存成功', { type: 'success' }) */
export declare function message(content: string, options?: MessageOptions): SuMessage;
export declare namespace message {
    var info: (content: string, duration?: number) => SuMessage;
    var success: (content: string, duration?: number) => SuMessage;
    var warning: (content: string, duration?: number) => SuMessage;
    var error: (content: string, duration?: number) => SuMessage;
}
export type { MessageType, MessageOptions };
