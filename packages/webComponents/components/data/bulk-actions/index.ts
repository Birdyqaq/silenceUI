import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { baseControlStyles, focusRingStyles } from '../../_shared/styles';

export interface BulkAction {
  key: string;
  label: string;
  disabled?: boolean;
}

export interface BulkActionDetail {
  action: string;
  keys: string[];
}

@customElement('su-bulk-actions')
export class SuBulkActions extends LitElement {
  @property({ attribute: false }) selectedKeys: readonly string[] = [];
  @property({ attribute: false }) actions: readonly BulkAction[] = [];
  @property({ type: Boolean }) pending = false;
  @property({ type: String }) label = '批量操作';

  static styles = [
    baseControlStyles,
    focusRingStyles,
    css`
      :host {
        display: block;
      }
      .bar {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 8px 16px;
        padding: 8px 12px;
        border: 1px solid var(--su-border-color);
        border-inline-start: 3px solid var(--su-border-color);
        background: var(--su-bg-card);
      }
      .bar[data-selected] {
        border-inline-start-color: var(--su-color-primary);
      }
      .status {
        margin-inline-end: auto;
        font-variant-numeric: tabular-nums;
      }
      .actions {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
      }
      button {
        font: inherit;
        color: inherit;
        background: var(--su-bg-card);
        border: 1px solid var(--su-border-color);
        border-radius: var(--su-radius-sm);
        padding: 4px 8px;
        cursor: pointer;
      }
      button:disabled {
        opacity: 0.5;
        cursor: default;
      }
    `,
  ];

  private get keys() {
    return [...new Set(this.selectedKeys)];
  }

  private request(action: BulkAction) {
    const keys = this.keys;
    if (this.pending || !keys.length || action.disabled || !this.actions.includes(action)) return;
    this.dispatchEvent(
      new CustomEvent<BulkActionDetail>('action-request', {
        detail: { action: action.key, keys },
        bubbles: true,
        composed: true,
      })
    );
  }

  private clearSelection() {
    const keys = this.keys;
    if (this.pending || !keys.length) return;
    this.dispatchEvent(
      new CustomEvent('clear-selection', {
        detail: { keys },
        bubbles: true,
        composed: true,
      })
    );
  }

  render() {
    const count = this.keys.length;
    const unavailable = this.pending || count === 0;
    return html`<div
      class="bar"
      part="bar"
      role="group"
      aria-label=${this.label}
      aria-busy=${String(this.pending)}
      ?data-selected=${count > 0}
    >
      <span class="status" role="status">${this.pending ? '处理中，' : ''}已选 ${count} 项</span>
      <div class="actions">
        ${this.actions.map(
          (action) => html`
            <button
              type="button"
              ?disabled=${unavailable || action.disabled}
              @click=${() => this.request(action)}
            >
              ${action.label}
            </button>
          `
        )}
        <button type="button" ?disabled=${unavailable} @click=${this.clearSelection}>
          清空选择
        </button>
      </div>
    </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'su-bulk-actions': SuBulkActions;
  }
}
