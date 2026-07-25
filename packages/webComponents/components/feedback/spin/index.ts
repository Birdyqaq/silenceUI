import { LitElement, css, html, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { baseControlStyles } from '../../_shared/styles';

@customElement('su-spin')
export class SuSpin extends LitElement {
  /** 为 false 时直接显示插槽内容，不显示遮罩 */
  @property({ type: Boolean }) spinning = true;
  @property({ type: String }) size: 'small' | 'medium' | 'large' = 'medium';
  @property({ type: String }) tip = '';

  static styles = [
    baseControlStyles,
    css`
      :host {
        display: block;
        position: relative;
      }

      .indicator {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 8px;
        padding: 8px;
      }

      .overlay {
        position: absolute;
        inset: 0;
        z-index: 10;
        background: var(--su-overlay);
        display: flex;
      }

      .overlay .indicator {
        margin: auto;
      }

      .spinner {
        border-radius: 50%;
        border: 2px solid rgba(var(--su-color-primary-rgb), 0.25);
        border-top-color: var(--su-color-primary);
        animation: rotate 0.8s linear infinite;
      }

      .spinner.small {
        width: 16px;
        height: 16px;
      }

      .spinner.medium {
        width: 24px;
        height: 24px;
      }

      .spinner.large {
        width: 34px;
        height: 34px;
        border-width: 3px;
      }

      .tip {
        color: var(--su-color-primary);
        font-size: var(--su-font-size-sm);
      }

      @keyframes rotate {
        to {
          transform: rotate(360deg);
        }
      }
    `
  ];

  private renderIndicator() {
    return html`
      <div class="indicator" role="status" aria-label=${this.tip || '加载中'}>
        <span class="spinner ${this.size}"></span>
        ${this.tip ? html`<span class="tip">${this.tip}</span>` : nothing}
      </div>
    `;
  }

  render() {
    const hasContent = this.childNodes.length > 0;
    if (!hasContent) {
      return this.spinning ? this.renderIndicator() : nothing;
    }
    return html`
      <slot></slot>
      ${this.spinning ? html`<div class="overlay">${this.renderIndicator()}</div>` : nothing}
    `;
  }
}
