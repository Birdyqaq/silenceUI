import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { baseControlStyles } from '../../_shared/styles';

export interface TimelineItem {
  label: string;
  description?: string;
  timestamp?: string;
  status?: 'primary' | 'success' | 'warning' | 'error';
}

@customElement('su-timeline')
export class SuTimeline extends LitElement {
  @property({ attribute: false }) items: TimelineItem[] = [];
  @property({ type: Boolean }) reverse = false;
  @property({ type: String }) label = '操作时间线';

  static styles = [
    baseControlStyles,
    css`
      :host {
        display: block;
      }
      ol {
        list-style: none;
        margin: 0;
        padding: 0;
      }
      li {
        position: relative;
        padding: 0 0 24px 26px;
        line-height: 1.6;
      }
      li:not(:last-child)::before {
        content: '';
        position: absolute;
        left: 5px;
        top: 13px;
        bottom: -3px;
        border-left: 2px solid var(--su-border-color);
      }
      .dot {
        position: absolute;
        left: 0;
        top: 7px;
        width: 12px;
        height: 12px;
        border-radius: 50%;
        background: var(--su-color-primary);
      }
      .success {
        background: var(--su-color-success);
      }
      .warning {
        background: var(--su-color-warning);
      }
      .error {
        background: var(--su-color-error);
      }
      .timestamp,
      .description {
        color: var(--su-text-2);
        font-size: var(--su-font-size-sm);
      }
      .description {
        white-space: pre-wrap;
      }
    `,
  ];

  /** 复制后反转，避免展示顺序改变调用方的业务数据。 */
  render() {
    const items = (Array.isArray(this.items) ? this.items : []).filter(
      (item) => item && typeof item.label === 'string'
    );
    if (this.reverse) items.reverse();
    return html`<ol aria-label=${this.label}>
      ${items.map(
        (item) => html`
          <li>
            <span
              class=${`dot ${['success', 'warning', 'error'].includes(item.status ?? '') ? item.status : ''}`}
              aria-hidden="true"
            ></span>
            ${item.timestamp ? html`<div class="timestamp">${item.timestamp}</div>` : ''}
            <div>${item.label}</div>
            ${item.description ? html`<div class="description">${item.description}</div>` : ''}
          </li>
        `
      )}
    </ol>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'su-timeline': SuTimeline;
  }
}
