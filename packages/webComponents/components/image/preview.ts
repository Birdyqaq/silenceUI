import { css, html, LitElement } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

@customElement('se-image-preview')
export class seImagePreview extends LitElement {

    @property({ type: String }) src: string = '';
    @state() private rotation: number = 0;

    static styles = css`
    import 'uno.css';
    @unocss-placeholder;

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
  `;

    handleClose() {
        this.dispatchEvent(new CustomEvent('close'));
    }

    handleRotate() {
        this.rotation = (this.rotation + 90) % 360;
    }

    render() {
        return html`
      <div class="preview">
        <img src="${this.src}" style="--rotation: ${this.rotation}deg;" />
        <button class="close-btn" @click="${this.handleClose}">关闭</button>
        <button class="rotate-btn" @click="${this.handleRotate}">旋转</button>
      </div>
    `;
    }
}
