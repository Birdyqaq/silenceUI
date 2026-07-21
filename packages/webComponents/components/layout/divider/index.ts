import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { baseControlStyles } from '../../_shared/styles';

@customElement('su-divider')
export class SuDivider extends LitElement {
  @property({ type: String, reflect: true }) direction: 'horizontal' | 'vertical' = 'horizontal';
  @property({ type: Boolean, reflect: true }) dashed = false;

  static styles = [
    baseControlStyles,
    css`
      :host {
        display: block;
      }

      :host([direction='vertical']) {
        display: inline-block;
        height: 1em;
        vertical-align: middle;
        margin: 0 10px;
        border-left: 1px solid var(--su-border-color);
      }

      .divider {
        display: flex;
        align-items: center;
        gap: 12px;
        margin: 16px 0;
        color: var(--su-text-3);
        font-size: var(--su-font-size-sm);
      }

      .divider::before,
      .divider::after {
        content: '';
        flex: 1;
        border-top: 1px solid var(--su-border-color);
      }

      :host([dashed]) .divider::before,
      :host([dashed]) .divider::after {
        border-top-style: dashed;
      }

      /* 无文字时两条线合并为一条 */
      .divider.plain {
        gap: 0;
      }
    `
  ];

  render() {
    if (this.direction === 'vertical') {
      return html``;
    }
    const hasText = this.childNodes.length > 0;
    return html`
      <div class="divider ${hasText ? '' : 'plain'}" role="separator">
        <slot></slot>
      </div>
    `;
  }
}
