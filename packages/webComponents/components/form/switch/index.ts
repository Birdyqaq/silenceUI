import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { FormValueController } from '../../_shared/form';
import { baseControlStyles, focusRingStyles } from '../../_shared/styles';

@customElement('su-switch')
export class SuSwitch extends LitElement {
  static formAssociated = true;

  @property({ type: Boolean }) checked = false;
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ type: String }) name = '';
  @property({ type: String }) value = 'on';

  private defaultChecked = false;
  private readonly formValue = new FormValueController(this, () =>
    this.disabled || !this.checked ? null : this.value
  );

  static styles = [
    baseControlStyles,
    focusRingStyles,
    css`
      :host {
        display: inline-flex;
      }

      button {
        width: 42px;
        height: 24px;
        border: none;
        border-radius: 999px;
        cursor: pointer;
        position: relative;
        transition: background-color 0.2s ease;
        background: var(--su-border-color-hover);
      }

      button::after {
        content: '';
        position: absolute;
        left: 3px;
        top: 3px;
        width: 18px;
        height: 18px;
        border-radius: 50%;
        background: #fff;
        transition: transform 0.2s ease;
        box-shadow: var(--su-shadow-sm);
      }

      button.checked {
        background: var(--su-color-primary);
      }

      button.checked::after {
        transform: translateX(18px);
      }

      button:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
    `,
  ];

  private handleClick() {
    if (this.disabled) return;
    this.checked = !this.checked;
    this.dispatchEvent(
      new CustomEvent('change', {
        detail: { checked: this.checked },
        bubbles: true,
        composed: true,
      })
    );
  }

  firstUpdated() {
    this.defaultChecked = this.checked;
  }

  formResetCallback() {
    this.checked = this.defaultChecked;
  }

  formStateRestoreCallback(state: string | File | FormData | null) {
    this.checked = state !== null;
  }

  focus(options?: FocusOptions) {
    this.shadowRoot?.querySelector('button')?.focus(options);
  }

  render() {
    return html`
      <button
        class=${this.checked ? 'checked' : ''}
        type="button"
        role="switch"
        aria-checked=${this.checked ? 'true' : 'false'}
        ?disabled=${this.disabled}
        @click=${this.handleClick}
      ></button>
    `;
  }
}
