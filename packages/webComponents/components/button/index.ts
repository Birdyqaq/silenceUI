// src/button/se-button.ts
import { html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { rippleEffect } from '../../utils/ripple';
import { styleMap } from './styles';

@customElement('su-button')
export class SuButton extends LitElement {
  static styles = styleMap;

  @property({ type: String, reflect: true }) size = 'medium';
  @property({ type: String, reflect: true }) type = 'primary';
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ type: Boolean, reflect: true }) loading = false;
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
        const target = e.currentTarget as HTMLElement | null;
        rippleEffect(e, { color }, target ?? this);
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
