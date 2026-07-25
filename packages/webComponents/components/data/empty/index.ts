import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { baseControlStyles } from '../../_shared/styles';

@customElement('su-empty')
export class SuEmpty extends LitElement {
  @property({ type: String }) description = '暂无数据';

  static styles = [
    baseControlStyles,
    css`
      :host {
        display: block;
      }

      .empty {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 10px;
        padding: 32px 16px;
        color: var(--su-text-3);
      }

      .icon {
        width: 56px;
        height: 40px;
        border: 2px dashed var(--su-border-color);
        border-radius: var(--su-radius-sm);
        position: relative;
      }

      .icon::after {
        content: '';
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        width: 24px;
        height: 3px;
        border-radius: 999px;
        background: var(--su-border-color);
      }

      .description {
        font-size: var(--su-font-size-sm);
      }
    `
  ];

  render() {
    return html`
      <div class="empty">
        <span class="icon" aria-hidden="true"></span>
        <span class="description">${this.description}</span>
        <slot></slot>
      </div>
    `;
  }
}
