import { LitElement, css, html, type PropertyValues } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { baseControlStyles } from '../../_shared/styles';

type MessageType = 'info' | 'success' | 'warning' | 'error';

const ICONS: Record<MessageType, string> = {
  info: 'ℹ',
  success: '✓',
  warning: '⚠',
  error: '✕',
};

@customElement('su-message')
export class SuMessage extends LitElement {
  @property({ type: String }) type: MessageType = 'info';
  @property({ type: Number }) duration = 3000;

  private timer: ReturnType<typeof setTimeout> | undefined;
  private dismissed = false;

  static styles = [
    baseControlStyles,
    css`
      :host {
        display: block;
      }

      .message {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        background: var(--su-bg-card);
        border: 1px solid var(--su-border-color);
        border-radius: var(--su-radius-sm);
        box-shadow: var(--su-shadow-md);
        padding: 9px 14px;
        font-size: var(--su-font-size-sm);
        color: var(--su-text-1);
        animation: slide-in 0.2s ease;
      }

      @keyframes slide-in {
        from {
          opacity: 0;
          transform: translateY(-8px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      .icon.info {
        color: var(--su-color-info);
      }

      .icon.success {
        color: var(--su-color-success);
      }

      .icon.warning {
        color: var(--su-color-warning);
      }

      .icon.error {
        color: var(--su-color-error);
      }
    `,
  ];

  connectedCallback() {
    super.connectedCallback();
    this.dismissed = false;
    if (this.hasUpdated) this.startTimer();
  }

  disconnectedCallback() {
    this.clearTimer();
    super.disconnectedCallback();
  }

  protected updated(changedProperties: PropertyValues<this>) {
    if (changedProperties.has('duration')) this.startTimer();
  }

  private clearTimer() {
    if (this.timer === undefined) return;
    clearTimeout(this.timer);
    this.timer = undefined;
  }

  /** 修改持续时间或重新挂载时，从当前时刻重新计时。 */
  private startTimer() {
    this.clearTimer();
    if (
      this.isConnected &&
      !this.dismissed &&
      Number.isFinite(this.duration) &&
      this.duration > 0
    ) {
      this.timer = setTimeout(() => this.dismiss(), this.duration);
    }
  }

  dismiss() {
    if (this.dismissed) return;
    this.dismissed = true;
    this.clearTimer();
    this.dispatchEvent(new CustomEvent('close', { bubbles: true, composed: true }));
    this.remove();
  }

  render() {
    return html`
      <div class="message" role="status">
        <span class="icon ${this.type}" aria-hidden="true">${ICONS[this.type]}</span>
        <slot></slot>
      </div>
    `;
  }
}

let container: HTMLElement | null = null;

function ensureContainer(): HTMLElement {
  if (container && container.isConnected) return container;
  container = document.createElement('div');
  Object.assign(container.style, {
    position: 'fixed',
    top: '16px',
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: '2000',
    display: 'grid',
    gap: '8px',
    justifyItems: 'center',
    pointerEvents: 'none',
  });
  document.body.appendChild(container);
  return container;
}

interface MessageOptions {
  type?: MessageType;
  duration?: number;
}

/** 命令式消息提示：message('保存成功', { type: 'success' }) */
export function message(content: string, options: MessageOptions = {}): SuMessage {
  const el = document.createElement('su-message') as SuMessage;
  el.type = options.type ?? 'info';
  el.duration = options.duration ?? 3000;
  el.textContent = content;
  el.style.pointerEvents = 'auto';
  ensureContainer().appendChild(el);
  return el;
}

message.info = (content: string, duration?: number) => message(content, { type: 'info', duration });
message.success = (content: string, duration?: number) =>
  message(content, { type: 'success', duration });
message.warning = (content: string, duration?: number) =>
  message(content, { type: 'warning', duration });
message.error = (content: string, duration?: number) =>
  message(content, { type: 'error', duration });

export type { MessageType, MessageOptions };
