import { LitElement, css, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';
import {
  focusFirstElement,
  getDeepActiveElement,
  isTopOverlay,
  lockBodyScroll,
  registerOverlay,
  trapFocus,
  unregisterOverlay,
  unlockBodyScroll,
} from '../_shared/overlay';
import { baseControlStyles, focusRingStyles } from '../_shared/styles';

@customElement('se-image-preview')
export class SeImagePreview extends LitElement {
  @property({ type: String }) src = '';
  @property({ type: String }) alt = '';
  @state() private rotation = 0;

  private previouslyFocused: HTMLElement | null = null;

  static styles = [
    baseControlStyles,
    focusRingStyles,
    css`
      :host {
        position: fixed;
        inset: 0;
        z-index: 1200;
      }

      .preview {
        position: fixed;
        inset: 0;
        display: grid;
        place-items: center;
        padding: 56px;
        background: rgba(15, 23, 42, 0.82);
      }

      img {
        display: block;
        max-width: 100%;
        max-height: calc(100vh - 112px);
        object-fit: contain;
        transition: transform 0.2s ease;
      }

      .toolbar {
        position: fixed;
        top: 16px;
        right: 16px;
        display: flex;
        gap: 8px;
      }

      button {
        min-width: 40px;
        min-height: 36px;
        border: 1px solid rgba(255, 255, 255, 0.35);
        border-radius: var(--su-radius-sm);
        background: rgba(17, 24, 39, 0.88);
        color: #fff;
        cursor: pointer;
        font: inherit;
        padding: 6px 10px;
      }

      button:hover {
        background: rgb(17, 24, 39);
      }

      @media (max-width: 640px) {
        .preview {
          padding: 64px 16px 24px;
        }

        img {
          max-height: calc(100vh - 88px);
        }
      }
    `,
  ];

  private onKeydown = (event: KeyboardEvent) => {
    if (!isTopOverlay(this)) return;
    const preview = this.shadowRoot?.querySelector<HTMLElement>('.preview');
    if (preview) trapFocus(event, preview);

    if (event.key === 'Escape') {
      event.preventDefault();
      this.close();
    }
  };

  connectedCallback() {
    super.connectedCallback();
    this.previouslyFocused = getDeepActiveElement();
    registerOverlay(this);
    lockBodyScroll();
    window.addEventListener('keydown', this.onKeydown);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('keydown', this.onKeydown);
    unregisterOverlay(this);
    unlockBodyScroll();
    if (this.previouslyFocused?.isConnected) this.previouslyFocused.focus();
  }

  firstUpdated() {
    const preview = this.shadowRoot?.querySelector<HTMLElement>('.preview');
    if (preview) focusFirstElement(preview);
  }

  private close() {
    this.dispatchEvent(new CustomEvent('close', { bubbles: true, composed: true }));
  }

  private closeByMask(event: Event) {
    if (event.target === event.currentTarget) this.close();
  }

  private rotate() {
    this.rotation = (this.rotation + 90) % 360;
  }

  render() {
    return html`
      <div
        class="preview"
        role="dialog"
        aria-modal="true"
        aria-label="图片预览"
        tabindex="-1"
        @click=${this.closeByMask}
      >
        <img
          src=${this.src}
          alt=${this.alt}
          style=${styleMap({ transform: `rotate(${this.rotation}deg)` })}
        />
        <div class="toolbar">
          <button type="button" aria-label="顺时针旋转 90 度" @click=${this.rotate}>旋转</button>
          <button type="button" aria-label="关闭图片预览" @click=${this.close}>关闭</button>
        </div>
      </div>
    `;
  }
}

/** @deprecated Use SeImagePreview. */
export { SeImagePreview as seImagePreview };
