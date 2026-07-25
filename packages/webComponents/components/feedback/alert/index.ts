import { LitElement, css, html, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { baseControlStyles } from '../../_shared/styles';

type AlertType = 'info' | 'success' | 'warning' | 'error';

const ICONS: Record<AlertType, string> = {
  info: 'ℹ',
  success: '✓',
  warning: '⚠',
  error: '✕'
};

@customElement('su-alert')
export class SuAlert extends LitElement {
  @property({ type: String }) type: AlertType = 'info';
  @property({ type: String }) header = '';
  @property({ type: Boolean }) closable = false;
  @property({ type: Boolean }) showIcon = true;

  @state() private closed = false;

  static styles = [
    baseControlStyles,
    css`
      :host {
        display: block;
      }

      .alert {
        display: flex;
        gap: 10px;
        align-items: flex-start;
        border: 1px solid transparent;
        border-radius: var(--su-radius-sm);
        padding: 10px 12px;
        font-size: var(--su-font-size-sm);
      }

      .alert.info {
        color: var(--su-color-info);
        background: rgba(var(--su-color-info-rgb), 0.08);
        border-color: rgba(var(--su-color-info-rgb), 0.3);
      }

      .alert.success {
        color: var(--su-color-success);
        background: rgba(var(--su-color-success-rgb), 0.08);
        border-color: rgba(var(--su-color-success-rgb), 0.3);
      }

      .alert.warning {
        color: var(--su-color-warning);
        background: rgba(var(--su-color-warning-rgb), 0.1);
        border-color: rgba(var(--su-color-warning-rgb), 0.3);
      }

      .alert.error {
        color: var(--su-color-error);
        background: rgba(var(--su-color-error-rgb), 0.08);
        border-color: rgba(var(--su-color-error-rgb), 0.3);
      }

      .icon {
        flex: none;
        line-height: 1.5;
      }

      .main {
        flex: 1;
        min-width: 0;
      }

      .header {
        font-weight: 600;
        margin-bottom: 2px;
      }

      .content {
        color: var(--su-text-2);
      }

      .close {
        flex: none;
        border: none;
        background: transparent;
        cursor: pointer;
        color: var(--su-text-3);
        padding: 0;
        line-height: 1.5;
      }

      .close:hover {
        color: var(--su-text-1);
      }
    `
  ];

  private handleClose() {
    this.closed = true;
    this.dispatchEvent(new CustomEvent('close', { bubbles: true, composed: true }));
  }

  render() {
    if (this.closed) return nothing;
    return html`
      <div class="alert ${this.type}" role="alert">
        ${this.showIcon ? html`<span class="icon">${ICONS[this.type]}</span>` : nothing}
        <div class="main">
          ${this.header ? html`<div class="header">${this.header}</div>` : nothing}
          <div class="content"><slot></slot></div>
        </div>
        ${this.closable
          ? html`<button class="close" type="button" aria-label="关闭" @click=${this.handleClose}>✕</button>`
          : nothing}
      </div>
    `;
  }
}

export type { AlertType };
