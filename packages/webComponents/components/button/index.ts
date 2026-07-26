import { html, LitElement, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { rippleEffect } from '../../utils/ripple';
import { styleMap } from './styles';
import type { ButtonIconPosition, ButtonSize, ButtonType } from './type';

@customElement('su-button')
export class SuButton extends LitElement {
  static styles = styleMap;

  @property({ type: String, reflect: true }) size: ButtonSize = 'medium';
  @property({ type: String, reflect: true }) type: ButtonType = 'primary';
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ type: Boolean, reflect: true }) loading = false;
  @property({ type: String }) iconClass = '';
  @property({ type: String }) iconPosition: ButtonIconPosition = 'left';
  @property({ type: String }) rippleColor = '';
  @property({ type: Boolean }) ripple = true;
  @property({ type: Boolean, reflect: true }) block = false;
  @property({ type: Boolean, reflect: true }) round = false;
  /** 原生 button 的 type，表单场景可设为 submit / reset */
  @property({ type: String }) nativeType: 'button' | 'submit' | 'reset' = 'button';

  private get isInactive() {
    return this.disabled || this.loading;
  }

  private handleClick(e: MouseEvent) {
    if (this.isInactive) {
      e.stopImmediatePropagation();
      e.preventDefault();
      return;
    }

    if (!this.ripple) return;

    try {
      const target = e.currentTarget as HTMLElement | null;
      rippleEffect(
        e,
        this.rippleColor ? { color: this.rippleColor } : {},
        target ?? undefined
      );
    } catch (error) {
      console.error('Error creating ripple effect:', error);
    }
  }

  private renderIcon(position: ButtonIconPosition) {
    if (!this.iconClass || this.iconPosition !== position) return nothing;
    return html`<i class="icon ${position} ${this.iconClass}" aria-hidden="true"></i>`;
  }

  render() {
    return html`
      <button
        type=${this.nativeType}
        ?disabled=${this.isInactive}
        aria-busy=${this.loading ? 'true' : 'false'}
        aria-disabled=${this.isInactive ? 'true' : 'false'}
        @click=${this.handleClick}
      >
        ${this.loading ? html`<span class="spinner" aria-hidden="true"></span>` : nothing}
        <span class="label">
          ${this.renderIcon('left')}
          <slot></slot>
          ${this.renderIcon('right')}
        </span>
      </button>
    `;
  }
}

export type { ButtonIconPosition, ButtonSize, ButtonType } from './type';
