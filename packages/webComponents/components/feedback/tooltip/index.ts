import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { baseControlStyles } from '../../_shared/styles';

@customElement('su-tooltip')
export class SuTooltip extends LitElement {
  @property({ type: String }) content = '';
  @property({ type: String, reflect: true }) placement: 'top' | 'bottom' | 'left' | 'right' = 'top';

  static styles = [
    baseControlStyles,
    css`
      :host {
        display: inline-block;
        position: relative;
      }

      .bubble {
        position: absolute;
        z-index: 1100;
        max-width: 260px;
        width: max-content;
        background: rgba(17, 24, 39, 0.92);
        color: #fff;
        font-size: var(--su-font-size-xs);
        line-height: 1.5;
        padding: 6px 10px;
        border-radius: var(--su-radius-sm);
        opacity: 0;
        visibility: hidden;
        transition: opacity 0.15s ease;
        pointer-events: none;
      }

      :host(:hover) .bubble,
      :host(:focus-within) .bubble {
        opacity: 1;
        visibility: visible;
      }

      :host([placement='top']) .bubble {
        bottom: calc(100% + 8px);
        left: 50%;
        transform: translateX(-50%);
      }

      :host([placement='bottom']) .bubble {
        top: calc(100% + 8px);
        left: 50%;
        transform: translateX(-50%);
      }

      :host([placement='left']) .bubble {
        right: calc(100% + 8px);
        top: 50%;
        transform: translateY(-50%);
      }

      :host([placement='right']) .bubble {
        left: calc(100% + 8px);
        top: 50%;
        transform: translateY(-50%);
      }
    `
  ];

  render() {
    return html`
      <slot></slot>
      <div class="bubble" role="tooltip">${this.content}</div>
    `;
  }
}
