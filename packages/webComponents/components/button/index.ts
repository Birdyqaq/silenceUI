import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import uno from "../../uno.config.ts"
type StringType = string | null | undefined;
@customElement('button-component')
export class ButtonComponent extends LitElement {

  @property({ type: String }) _size = 'medium';
  @property({ type: String }) _status: StringType = 'primary';

  static styles = css`
    :host {
      box-sizing: border-box;
      display: inline-block;
      position: relative;
      overflow: hidden;
    }

    button {
      background: var(--set-bg, #cccccc);
      color: var(--set-col, #fff);
      transition: opacity 0.3s ease; 
      position: relative;
      overflow: hidden;
    }
    button:hover {
      // opacity: 0.8; 
    }
    .ripple-effect {
      position: absolute;
      border-radius: 50%; /* 圆形效果 */
      background-color: rgba(255, 255, 255, 0.4); /* 半透明白色 */
      animation: ripple-animation 3s linear; /* 定义动画效果 */
    }

    @keyframes ripple-animation {
      to {
        transform: scale(2); /* 在 0.5s 内将大小放大到原来的两倍 */
        opacity: 0; /* 透明度为 0 */
      }
    }
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



    const backgroundColor = uno.theme!.colors[this._status] || '';
    console.log(this._status, '123')
    this.style.setProperty('--set-bg', backgroundColor);
    this.style.setProperty('--set-col', 'white');

    return html`
      <button class="${sizeClasses} border-none cursor-pointer rounded" @click="${this.handleClick}">
        <slot></slot>
      </button>
    `;
  }
}
