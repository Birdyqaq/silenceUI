// src/button/se-button.ts
import { html, LitElement, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { rippleEffect } from '../../utils/ripple';

@customElement('su-button')
export class SuButton extends LitElement {
  static styles = css`
  :host {
    display: inline-block;
    position: relative;
    overflow: hidden;
    --ripple-color: rgba(0, 0, 0, 0.1);
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
    background-color: inherit; 
    color: inherit; 
    cursor: pointer;
    border-radius: inherit;
    overflow: hidden; 
    transition: all 0.2s ease;
    font-family: inherit;
    font-size: inherit;
    font-weight: inherit;
    line-height: inherit;
    text-decoration: none;
    border: none;
    outline: none;
  }

  button:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }

  button:focus-visible {
    outline: 2px solid var(--focus-color, #2563eb);
    outline-offset: 2px;
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

  /* 基础样式应用到 :host */
  :host([type="primary"]) {
    background-color: #3b82f6;
    color: white;
    padding: 8px 16px;
    border-radius: 6px;
    font-weight: 500;
  }

  :host([type="primary"]:hover) {
    background-color: #2563eb;
  }

  :host([type="secondary"]) {
    background-color: #6b7280;
    color: white;
    padding: 8px 16px;
    border-radius: 6px;
    font-weight: 500;
  }

  :host([type="secondary"]:hover) {
    background-color: #4b5563;
  }

  :host([type="success"]) {
    background-color: #10b981;
    color: white;
    padding: 8px 16px;
    border-radius: 6px;
    font-weight: 500;
  }

  :host([type="success"]:hover) {
    background-color: #059669;
  }

  :host([type="warning"]) {
    background-color: #f59e0b;
    color: white;
    padding: 8px 16px;
    border-radius: 6px;
    font-weight: 500;
  }

  :host([type="warning"]:hover) {
    background-color: #d97706;
  }

  :host([type="danger"]) {
    background-color: #ef4444;
    color: white;
    padding: 8px 16px;
    border-radius: 6px;
    font-weight: 500;
  }

  :host([type="danger"]:hover) {
    background-color: #dc2626;
  }

  /* 尺寸样式 */
  :host([size="small"]) {
    padding: 4px 8px;
    font-size: 0.875rem;
  }

  :host([size="medium"]) {
    padding: 8px 16px;
    font-size: 1rem;
  }

  :host([size="large"]) {
    padding: 12px 24px;
    font-size: 1.125rem;
  }

  :host([block]) {
    display: block;
    width: 100%;
  }

  :host([round]) {
    border-radius: 999px;
  }

  /* 禁用状态 */
  :host([disabled]) {
    opacity: 0.5;
    cursor: not-allowed;
    pointer-events: none;
  }

  /* 加载状态 */
  :host([loading]) button {
    cursor: wait;
  }

  .icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  .icon.left {
    margin-right: 0.5rem;
  }

  .icon.right {
    margin-left: 0.5rem;
  }
  `

  @property({ type: String }) size: 'small' | 'medium' | 'large' = 'medium';
  @property({ type: String }) type: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' | 'light' | 'dark' | 'link' = 'primary';
  @property({ type: Boolean }) disabled = false;
  @property({ type: Boolean }) loading = false;
  @property({ type: String }) iconClass = '';
  @property({ type: String }) iconPosition: 'left' | 'right' = 'left';
  @property({ type: String }) rippleColor = '';
  @property({ type: Boolean }) ripple = true; // 新增：控制水波纹效果的开关
  @property({ type: Boolean, reflect: true }) block = false; // 占满父容器
  @property({ type: Boolean, reflect: true }) round = false; // 胶囊形

  private handleClick(e: MouseEvent) {
    if (this.disabled || this.loading) {
      e.stopImmediatePropagation();
      e.preventDefault();
      return;
    }

    // 只有在启用水波纹效果时才执行
    if (this.ripple) {
      // 使用自定义颜色或根据按钮类型设置默认颜色
      let color = this.rippleColor;
      if (!color) {
        // 根据按钮类型设置默认水波纹颜色
        switch (this.type) {
          case 'primary':
          case 'secondary':
          case 'success':
          case 'warning':
          case 'danger':
            color = 'rgba(255, 255, 255, 0.3)';
            break;
          default:
            color = 'rgba(0, 0, 0, 0.1)';
        }
      }
      
      try {
        rippleEffect(e, { color }, this);
      } catch (error) {
        console.error('Error creating ripple effect:', error);
      }
    }
  }

  render() {
    return html`
      <button
        class=${this.getButtonClasses()}
        @click=${this.handleClick}
        ?disabled=${this.disabled}
        type="button"
      >
        ${this.renderIcon('left')}
        ${this.loading ? this.renderSpinner() : html`<slot></slot>`}
        ${this.renderIcon('right')}
      </button>
    `;
  }

  private getButtonClasses() {
    return [
      this.disabled ? 'disabled' : '',
      this.loading ? 'loading' : ''
    ].filter(Boolean).join(' ');
  }

  private renderSpinner() {
    return html`<span class="spinner"></span>`;
  }

  private renderIcon(position: 'left' | 'right') {
    if (!this.iconClass || this.iconPosition !== position) return;
    return html`<i class="icon ${position} ${this.iconClass}"></i>`;
  }
}
