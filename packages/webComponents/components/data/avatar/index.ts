import { LitElement, css, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { baseControlStyles } from '../../_shared/styles';

@customElement('su-avatar')
export class SuAvatar extends LitElement {
  @property({ type: String }) src = '';
  /** 图片加载失败或未提供 src 时，取 name 首字符作为占位 */
  @property({ type: String }) name = '';
  @property({ type: String }) size: 'small' | 'medium' | 'large' = 'medium';
  @property({ type: String }) shape: 'circle' | 'square' = 'circle';

  @state() private loadError = false;

  static styles = [
    baseControlStyles,
    css`
      :host {
        display: inline-flex;
      }

      .avatar {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
        background: var(--su-bg-muted);
        color: var(--su-text-2);
        font-weight: 600;
        flex: none;
      }

      .avatar.circle {
        border-radius: 50%;
      }

      .avatar.square {
        border-radius: var(--su-radius-sm);
      }

      .avatar.small {
        width: 24px;
        height: 24px;
        font-size: var(--su-font-size-xs);
      }

      .avatar.medium {
        width: 32px;
        height: 32px;
        font-size: var(--su-font-size-sm);
      }

      .avatar.large {
        width: 44px;
        height: 44px;
        font-size: var(--su-font-size-lg);
      }

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    `
  ];

  updated(changed: Map<string, unknown>) {
    if (changed.has('src')) {
      this.loadError = false;
    }
  }

  render() {
    const showImage = this.src && !this.loadError;
    return html`
      <span class="avatar ${this.shape} ${this.size}">
        ${showImage
          ? html`<img src=${this.src} alt=${this.name} @error=${() => (this.loadError = true)} />`
          : html`${this.name.slice(0, 1).toUpperCase()}`}
      </span>
    `;
  }
}
