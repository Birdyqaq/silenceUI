import { LitElement, css, html, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { baseControlStyles } from '../../_shared/styles';

@customElement('su-badge')
export class SuBadge extends LitElement {
  @property({ type: Number }) count = 0;
  @property({ type: Number }) max = 99;
  @property({ type: Boolean }) dot = false;
  @property({ type: Boolean }) showZero = false;

  static styles = [
    baseControlStyles,
    css`
      :host {
        display: inline-flex;
        position: relative;
      }

      .badge {
        position: absolute;
        top: 0;
        right: 0;
        transform: translate(50%, -50%);
        background: var(--su-color-error);
        color: var(--su-color-error-contrast, #fff);
        border-radius: 999px;
        font-size: var(--su-font-size-xs);
        line-height: 1;
        padding: 3px 6px;
        min-width: 8px;
        text-align: center;
        box-shadow: 0 0 0 1px var(--su-bg-card);
      }

      .badge.dot {
        width: 8px;
        height: 8px;
        min-width: 0;
        padding: 0;
      }
    `
  ];

  private get text() {
    return this.count > this.max ? `${this.max}+` : String(this.count);
  }

  render() {
    const visible = this.dot || this.count > 0 || (this.showZero && this.count === 0);
    return html`
      <slot></slot>
      ${visible ? html`<span class="badge ${this.dot ? 'dot' : ''}">${this.dot ? '' : this.text}</span>` : nothing}
    `;
  }
}
