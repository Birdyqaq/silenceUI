import { LitElement, css, html, nothing, type PropertyValues } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { FormValueController } from '../../_shared/form';
import { baseControlStyles, focusRingStyles } from '../../_shared/styles';

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

function isValidDateValue(value: string) {
  const match = DATE_PATTERN.exec(value);
  if (!match) return false;
  const [year, month, day] = value.split('-').map(Number);
  if (year < 1 || month < 1 || month > 12 || day < 1) return false;
  const leapYear = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
  const daysInMonth = [31, leapYear ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  return day <= daysInMonth[month - 1];
}

@customElement('su-date-picker')
export class SuDatePicker extends LitElement {
  static formAssociated = true;

  @property({ type: String }) value = '';
  @property({ type: String }) name = '';
  @property({ type: String }) min = '';
  @property({ type: String }) max = '';
  @property({ type: String }) label = '';
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ type: Boolean }) readonly = false;

  private defaultValue = '';
  private readonly formValue = new FormValueController(this, () =>
    this.disabled ? null : this.value
  );

  static styles = [
    baseControlStyles,
    focusRingStyles,
    css`
      :host {
        display: block;
      }

      .field {
        display: grid;
        gap: 6px;
      }

      label {
        color: var(--su-text-2);
        font-size: var(--su-font-size-sm);
        font-weight: 500;
      }

      input {
        width: 100%;
        min-height: 38px;
        border: 1px solid var(--su-border-color);
        border-radius: var(--su-radius-sm);
        background: var(--su-bg-card);
        color: var(--su-text-1);
        padding: 8px 10px;
        font: inherit;
      }

      input:hover:not(:disabled):not(:read-only) {
        border-color: var(--su-border-color-hover);
      }

      input:focus {
        border-color: var(--su-color-primary);
        box-shadow: 0 0 0 3px rgba(var(--su-color-primary-rgb), 0.16);
        outline: none;
      }

      input:disabled,
      input:read-only {
        background: var(--su-bg-muted);
        color: var(--su-text-3);
        cursor: not-allowed;
      }
    `,
  ];

  private clamp(value: string) {
    if (!isValidDateValue(value)) return '';
    if (isValidDateValue(this.min) && value < this.min) return this.min;
    if (isValidDateValue(this.max) && value > this.max) return this.max;
    return value;
  }

  private handleChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const next = input.value ? this.clamp(input.value) : '';
    this.value = next;
    input.value = next;
    this.dispatchEvent(
      new CustomEvent('change', {
        detail: { value: next },
        bubbles: true,
        composed: true,
      })
    );
  }

  protected willUpdate(changedProperties: PropertyValues<this>) {
    if (
      this.value &&
      (changedProperties.has('value') ||
        changedProperties.has('min') ||
        changedProperties.has('max'))
    ) {
      this.value = this.clamp(this.value);
    }
  }

  protected firstUpdated() {
    this.defaultValue = this.value;
  }

  formResetCallback() {
    this.value = this.defaultValue;
  }

  formStateRestoreCallback(state: string | File | FormData | null) {
    if (typeof state === 'string') this.value = state ? this.clamp(state) : '';
  }

  focus(options?: FocusOptions) {
    this.shadowRoot?.querySelector('input')?.focus(options);
  }

  showPicker() {
    const input = this.shadowRoot?.querySelector<HTMLInputElement>('input');
    if (this.disabled || this.readonly) return;
    input?.showPicker?.();
  }

  render() {
    return html`
      <div class="field">
        ${this.label ? html`<label for="date-input">${this.label}</label>` : nothing}
        <input
          id="date-input"
          type="date"
          .value=${this.value}
          .min=${this.min}
          .max=${this.max}
          ?disabled=${this.disabled}
          ?readonly=${this.readonly}
          aria-label=${this.label || '选择日期'}
          aria-readonly=${this.readonly ? 'true' : 'false'}
          @change=${this.handleChange}
        />
      </div>
    `;
  }
}
