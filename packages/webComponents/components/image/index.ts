import { LitElement, css, html, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';
import { baseControlStyles, focusRingStyles } from '../_shared/styles';
import './preview';

export type ImageFit = 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';

@customElement('se-image')
export class SeImage extends LitElement {
  @property({ type: String }) src = '';
  @property({ type: String }) alt = '';
  @property({ type: Boolean }) lazy = false;
  @property({ type: String }) placeholder = '';
  @property({ type: String }) errorPlaceholder = '';
  @property({ type: Number }) width = 100;
  @property({ type: Number }) height = 100;
  @property({ type: String }) fit: ImageFit = 'cover';
  @property({ type: Boolean }) preview = true;

  @state() private isError = false;
  @state() private isLoaded = false;
  @state() private isPreviewVisible = false;

  static styles = [
    baseControlStyles,
    focusRingStyles,
    css`
      :host {
        display: inline-block;
      }

      .frame,
      .trigger {
        position: relative;
        display: block;
        width: 100%;
        height: 100%;
        overflow: hidden;
        border-radius: var(--su-radius-sm);
        background: var(--su-bg-muted);
      }

      .trigger {
        border: 0;
        padding: 0;
        cursor: zoom-in;
        color: inherit;
      }

      img {
        position: absolute;
        inset: 0;
        display: block;
        width: 100%;
        height: 100%;
      }

      .placeholder {
        object-fit: cover;
      }

      .image {
        opacity: 0;
        transition: opacity 0.2s ease;
      }

      .image.loaded {
        opacity: 1;
      }
    `,
  ];

  protected willUpdate(changedProperties: Map<PropertyKey, unknown>) {
    if (changedProperties.has('src')) {
      this.isError = false;
      this.isLoaded = false;
      this.isPreviewVisible = false;
    }
  }

  private get displaySrc() {
    return this.isError && this.errorPlaceholder ? this.errorPlaceholder : this.src;
  }

  private handleLoad() {
    this.isLoaded = true;
  }

  private handleError() {
    if (!this.isError && this.errorPlaceholder) {
      this.isError = true;
      this.isLoaded = false;
      return;
    }
    this.isLoaded = true;
  }

  private openPreview() {
    if (!this.preview || !this.displaySrc) return;
    this.isPreviewVisible = true;
  }

  private closePreview() {
    this.isPreviewVisible = false;
  }

  private renderImage() {
    return html`
      ${!this.isLoaded && this.placeholder
        ? html`<img class="placeholder" src=${this.placeholder} alt="" aria-hidden="true" />`
        : nothing}
      <img
        class="image ${this.isLoaded ? 'loaded' : ''}"
        src=${this.displaySrc}
        alt=${this.alt}
        loading=${this.lazy ? 'lazy' : 'eager'}
        style=${styleMap({ objectFit: this.fit })}
        @load=${this.handleLoad}
        @error=${this.handleError}
      />
    `;
  }

  render() {
    const size = styleMap({
      width: `${Math.max(0, this.width)}px`,
      height: `${Math.max(0, this.height)}px`,
    });

    return html`
      <div style=${size}>
        ${this.preview
          ? html`
              <button
                class="trigger"
                type="button"
                aria-label=${this.alt ? `预览图片：${this.alt}` : '预览图片'}
                @click=${this.openPreview}
              >
                ${this.renderImage()}
              </button>
            `
          : html`<div class="frame">${this.renderImage()}</div>`}
      </div>
      ${this.isPreviewVisible
        ? html`
            <se-image-preview
              .src=${this.displaySrc}
              .alt=${this.alt}
              @close=${this.closePreview}
            ></se-image-preview>
          `
        : nothing}
    `;
  }
}

/** @deprecated Use SeImage. */
export { SeImage as seImage };
