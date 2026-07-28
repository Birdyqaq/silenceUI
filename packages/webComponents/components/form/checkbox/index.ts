import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { FormValueController } from '../../_shared/form';
import { baseControlStyles } from '../../_shared/styles';

@customElement('su-checkbox')
export class SuCheckbox extends LitElement {
  static formAssociated = true;

  @property({ type: Boolean }) checked = false;
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ type: String }) name = '';
  @property({ type: String }) value = 'on';
  @property({ type: String }) label = '';

  private defaultChecked = false;
  private readonly formValue = new FormValueController(this, () =>
    this.disabled || !this.checked ? null : this.value
  );

  static styles = [
    baseControlStyles,
    css`
      :host {
        display: inline-flex;
      }

      label {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        cursor: pointer;
        color: var(--su-text-2);
        font-size: var(--su-font-size-sm);
      }

      input[type='checkbox'] {
        width: 16px;
        height: 16px;
        accent-color: var(--su-color-primary);
      }

      input:disabled,
      input:disabled + span {
        cursor: not-allowed;
        opacity: 0.55;
      }
    `,
  ];

  private onChange(event: Event) {
    this.checked = (event.target as HTMLInputElement).checked;
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
    this.shadowRoot?.querySelector('input')?.focus(options);
  }

  render() {
    return html`
      <label>
        <input
          type="checkbox"
          .checked=${this.checked}
          ?disabled=${this.disabled}
          @change=${this.onChange}
        />
        <span>${this.label}</span>
      </label>
    `;
  }
}
