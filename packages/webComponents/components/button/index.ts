import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('button-component')
export class ButtonComponent extends LitElement {

  @property({ type: String }) _size = 'medium';
  @property({ type: String }) _status = 'primary';
  // @property({ type: String }) _color = 'primary';
  @property({ type: String }) type = 'primary';
  static styles = css`
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
    const sizeClasses = {
      small: 'px-2 py-1 text-sm',
      medium: 'px-3 py-2 text-base',
      large: 'px-4 py-3 text-lg'
    }[this.size] || '';


    const typeClasses = {
      primary: 'bg-blue text-white hover:bg-blue-500 ',
      secondary: 'bg-green text-white hover:bg-green-500',
      success: 'bg-green-500 text-white hover:bg-green-600',
      warning: 'bg-yellow-500 text-white hover:bg-yellow-600',
      danger: 'bg-red-500 text-white hover:bg-red-600',
      info: 'bg-blue-500 text-white hover:bg-blue-600',
      light: 'bg-gray-200 text-gray-600 hover:bg-gray-300',
      dark: 'bg-gray-800 text-white hover:bg-gray-900',
      link: 'text-blue-500 hover:text-blue-600 bg-transparent border-none line-height-normal'
    }[this.type] || '';
    // i-ph-anchor-simple-thin

    return html`
      <button class="${sizeClasses} border-none  i-carbon-sun dark:i-carbon-moon cursor-pointer rounded ${typeClasses}"  @click="${this.handleClick}">
       <slot></slot> 
      </button>
    `;
  }
}
