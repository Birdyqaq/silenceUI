import { css, html, LitElement } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import './preview';

@customElement('se-image')
export class seImage extends LitElement {

  @property({ type: String }) src: string = '';
  @property({ type: String }) alt: string = '';
  @property({ type: Boolean }) lazy: boolean = false;
  @property({ type: String }) placeholder: string = '';
  @property({ type: String }) errorPlaceholder: string = '';
  @property({ type: Number }) width: Number = 100;
  @property({ type: Number }) height: Number = 100;
  @state() private isError: boolean = false;
  @state() private isPreviewVisible: boolean = false;
  @state() private rotation: number = 0;
  private _isVisible: boolean = false;
  private _observer?: IntersectionObserver;

  static styles = css`
    import 'uno.css';
    @unocss-placeholder;

    .image-container {
      @apply flex items-center justify-center w-full h-full relative;
    }

    img {
      @apply w-full h-auto block cursor-pointer;
    }

    .preview {
      @apply fixed top-0 left-0 w-full h-full bg-black bg-opacity-80 flex items-center justify-center z-1000;
    }

    .preview img {
      @apply max-w-90 max-h-90;
      transform: rotate(var(--rotation, 0deg));
    }

    .close-btn, .rotate-btn {
      @apply absolute top-2.5 right-2.5 bg-white border-none cursor-pointer p-2.5 text-base;
    }

    .rotate-btn {
      @apply right-12.5;
    }

    .preview-icon {
      @apply absolute top-2.5 right-2.5 bg-white border-none cursor-pointer p-2.5 text-base;
      display: none;
    }

    .image-container:hover .preview-icon {
      display: block;
    }
  `;

  firstUpdated() {
    if (this.lazy) {
      this._observer = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting) {
          this._isVisible = true;
          this._observer?.disconnect();
          this.requestUpdate();
        }
      });
      this._observer.observe(this.shadowRoot?.querySelector('img') as Element);
    }
  }

  loadImage() {
    const img = this.shadowRoot?.querySelector('img') as HTMLImageElement;
    if (img && this.src) {
      img.src = this.src;
    }
  }

  handleError() {
    this.isError = true;
  }

  handleImageClick() {
    this.isPreviewVisible = true;
  }

  handleClosePreview() {
    this.isPreviewVisible = false;
  }

  handleRotate() {
    this.rotation = (this.rotation + 90) % 360;
  }

  render() {
    return html`
      <div class="image-container" style="width: ${this.width + 'px'}; height: ${this.height + 'px'};">
        <img
          class="w-full h-auto block cursor-pointer"
          src="${this.isError ? this.errorPlaceholder : (this.lazy ? this.placeholder : this.src)}"
          alt="${this.alt}"
          @error="${this.handleError}"
          @click="${this.handleImageClick}"
          loading="${this.lazy ? 'lazy' : 'eager'}"
        />
        <button class="preview-icon" @click="${this.handleImageClick}">预览</button>
        ${this.isPreviewVisible ? html`
          <se-image-preview
            .src="${this.src}"
            @close="${this.handleClosePreview}"
          ></se-image-preview>
        ` : ''}
      </div>
    `;
  }
}

