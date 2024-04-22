import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('line-component')

export class LineComponent extends LitElement {

    @property({ type: String }) _size = 'medium';
    @property({ type: String }) _status = 'primary';
    // @property({ type: String }) _color = 'primary';
    @property({ type: String }) type = 'primary';
    static styles = css`
    import 'uno.css'
     @unocss-placeholder
  `
    constructor() {
        super();
        this._size = 'medium';
        this._status = 'primary';
    }

    @property({ type: String })
    get size() {
        return this._size;
    }

    set size(value) {
        this._size = value;
    }

    @property({ type: String })
    get status() {
        return this._status;
    }

    set status(value) {
        console.log(value, '123')
        this._status = value;
        this.requestUpdate();

    }

    handleClick(event: MouseEvent) {
        const button = this.shadowRoot?.querySelector('button');
        console.log(button, this)
        if (button) {
            const ripple = document.createElement('span');
            ripple.classList.add('ripple-effect');
            ripple.style.left = `${event.offsetX}px`; /* 设置水波纹的位置 */
            ripple.style.top = `${event.offsetY}px`; /* 设置水波纹的位置 */
            button.appendChild(ripple);

            // 在动画结束后移除水波纹效果
            ripple.addEventListener('animationend', () => {
                button.removeChild(ripple);
            });
        }
    }

    render() {
        return html`
      <div class="line i-quill-arrow-left"></div>
    `;
    }
}