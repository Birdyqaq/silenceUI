// src/button/se-button.ts
import { html, LitElement, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { rippleEffect } from '../../utils/ripple';
import { styleMap } from './styles';

@customElement('su-button') // 修改这里
export class SuButton extends LitElement {
  static styles = css`
   @unocss-placeholder; // 确保占位符被解析
  import 'uno.css';

  :host {
    display: inline-block;
    --ripple-color: rgba(0, 0, 0, 0.1); /* 默认水波纹颜色 */
  }

  @keyframes ripple {
    to {
      transform: scale(4);
      opacity: 0;
    }
  }

  .spinner {
    display: inline-block;
    width: 1rem;
    height: 1rem;
    border: 2px solid currentColor;
    border-radius: 50%;
    border-top-color: transparent;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  button {
    all: unset;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    position: relative;
    padding: 0;
    width: 100%;
    height: 100%;
    background-color: inherit; /* 确保背景颜色继承 */
    color: inherit; /* 确保文本颜色继承 */
    cursor: pointer;
    border-radius: inherit;
    overflow: hidden; /* 为水波纹效果裁剪 */
  }

  button:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }

  .ripple {
    position: absolute;
    border-radius: 50%;
    transform: scale(0);
    animation: ripple 600ms linear;
    background-color: var(--ripple-color);
    opacity: 0.3;
  }
`

  @property({ type: String }) size: 'small' | 'medium' | 'large' = 'medium';
  @property({ type: String }) type: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' | 'light' | 'dark' | 'link' = 'primary';
  @property({ type: Boolean }) disabled = false;
  @property({ type: Boolean }) loading = false;
  @property({ type: String }) iconClass = '';
  @property({ type: String }) iconPosition: 'left' | 'right' = 'left';
  @property({ type: String }) rippleColor = '';

  private handleClick(e: MouseEvent) {
    if (this.disabled || this.loading) {
      e.stopImmediatePropagation(); // 阻止事件冒泡
      e.preventDefault();
      return;
    }
    const color = this.rippleColor || getComputedStyle(this).getPropertyValue('--ripple-color');
    rippleEffect(e, { color });
  }

  render() {
    return html`
      <button
        class=${this.getButtonClasses()}
        @click=${this.handleClick}
        ?disabled=${this.disabled}
      >
        ${this.renderIcon('left')}
        ${this.loading ? this.renderSpinner() : html`<slot></slot>`}
        ${this.renderIcon('right')}
      </button>
    `;
  }

  private getButtonClasses() {
    return [
      'inline-block w-auto h-auto border-none rounded',
      this.getSizeClasses(),
      this.getTypeClasses(),
      this.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
      'relative overflow-hidden' // 为水波纹效果添加
    ].join(' ');
  }

  private getSizeClasses() {
    return {
      small: 'px-2 py-1 text-sm',
      medium: 'px-3 py-2 text-base',
      large: 'px-4 py-3 text-lg'
    }[this.size];
  }

  private getTypeClasses() {
    return {
      primary: 'bg-blue-500 text-white hover:bg-blue-600',
      secondary: 'bg-gray-600 text-white hover:bg-gray-700',
      success: 'bg-green-600 text-white hover:bg-green-700',
      warning: 'bg-yellow-600 text-white hover:bg-yellow-700',
      danger: 'bg-red-500 text-white hover:bg-red-600',
      info: 'bg-blue-400 text-white hover:bg-blue-500',
      light: 'bg-gray-100 text-gray-800 hover:bg-gray-200',
      dark: 'bg-gray-900 text-white hover:bg-gray-800',
      link: 'text-blue-600 hover:text-blue-700 bg-transparent'
    }[this.type];
  }

  private renderSpinner() {
    return html`<span class="spinner"></span>`;
  }

  private renderIcon(position: 'left' | 'right') {
    if (!this.iconClass || this.iconPosition !== position) return;
    return html`<i class="icon ${position === 'right' ? 'ml-2' : 'mr-2'} ${this.iconClass}"></i>`;
  }

  isPrimary() {
    // 错误实现：本应 return true，但写成了 false
    return false;
  }
}

export * from './index';