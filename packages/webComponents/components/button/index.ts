import { html, LitElement, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { rippleEffect } from '../../utils/ripple';
import { findClosestForm } from '../_shared/utils';
import { styleMap } from './styles';
import type { ButtonIconPosition, ButtonSize, ButtonType } from './type';
import '../icon';

@customElement('su-button')
export class SuButton extends LitElement {
  static styles = styleMap;

  @property({ type: String, reflect: true }) size: ButtonSize = 'medium';
  @property({ type: String, reflect: true }) type: ButtonType = 'primary';
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ type: Boolean, reflect: true }) loading = false;
  @property({ type: String }) iconClass = '';
  @property({ type: String }) icon = '';
  @property({ type: String }) iconPosition: ButtonIconPosition = 'left';
  @property({ type: String }) rippleColor = '';
  @property({ type: Boolean }) ripple = true;
  @property({ type: Boolean, reflect: true }) block = false;
  @property({ type: Boolean, reflect: true }) round = false;
  /** 原生 button 的 type，表单场景可设为 submit / reset */
  @property({ type: String, attribute: 'native-type' }) nativeType: 'button' | 'submit' | 'reset' =
    'button';

  static get observedAttributes() {
    return [...super.observedAttributes, 'nativetype'];
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
    if (name === 'nativetype') {
      if (!this.hasAttribute('native-type')) {
        this.nativeType =
          newValue === 'submit' || newValue === 'reset' || newValue === 'button'
            ? newValue
            : 'button';
      }
      return;
    }
    super.attributeChangedCallback(name, oldValue, newValue);
  }

  private get isInactive() {
    return this.disabled || this.loading;
  }

  private get resolvedNativeType(): 'button' | 'submit' | 'reset' {
    const attribute = this.getAttribute('native-type') ?? this.getAttribute('nativetype');
    if (attribute === 'submit' || attribute === 'reset' || attribute === 'button') return attribute;
    return this.nativeType ?? 'button';
  }

  private handleClick(e: MouseEvent) {
    if (this.isInactive) {
      e.stopImmediatePropagation();
      e.preventDefault();
      return;
    }

    if (this.ripple) {
      try {
        const target = e.currentTarget as HTMLElement | null;
        rippleEffect(e, this.rippleColor ? { color: this.rippleColor } : {}, target ?? undefined);
      } catch (error) {
        console.error('Error creating ripple effect:', error);
      }
    }

    const form = findClosestForm(this);
    if (!form) return;

    if (this.resolvedNativeType === 'submit') {
      e.preventDefault();
      form.requestSubmit();
    } else if (this.resolvedNativeType === 'reset') {
      e.preventDefault();
      form.reset();
    }
  }

  private renderIcon(position: ButtonIconPosition) {
    if (this.icon && this.iconPosition === position)
      return html`<su-icon class="icon ${position}" .name=${this.icon}></su-icon>`;
    if (!this.iconClass || this.iconPosition !== position) return nothing;
    return html`<i class="icon ${position} ${this.iconClass}" aria-hidden="true"></i>`;
  }

  render() {
    return html`
      <button
        type=${this.resolvedNativeType}
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
