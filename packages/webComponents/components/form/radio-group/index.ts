import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { FormValueController } from '../../_shared/form';
import { baseControlStyles } from '../../_shared/styles';
import { parseJsonArray } from '../../_shared/utils';

interface RadioOption {
  label: string;
  value: string;
  disabled?: boolean;
}

@customElement('su-radio-group')
export class SuRadioGroup extends LitElement {
  static formAssociated = true;

  @property({ type: Array, attribute: false }) options: RadioOption[] = [];
  @property({ type: String }) optionsJson = '';
  @property({ type: String }) value = '';
  @property({ type: String }) name = `su-radio-${Math.random().toString(36).slice(2)}`;
  @property({ type: Boolean, reflect: true }) disabled = false;

  private defaultValue = '';
  private readonly formValue = new FormValueController(this, () =>
    this.disabled || !this.value ? null : this.value
  );

  static styles = [
    baseControlStyles,
    css`
      :host {
        display: block;
      }

      .group {
        display: flex;
        flex-wrap: wrap;
        gap: 12px;
      }

      label {
        display: inline-flex;
        gap: 8px;
        align-items: center;
        color: var(--su-text-2);
        font-size: var(--su-font-size-sm);
      }

      input[type='radio'] {
        accent-color: var(--su-color-primary);
      }
    `,
  ];

  private get mergedOptions() {
    if (this.options.length > 0) return this.options;
    return parseJsonArray<RadioOption>(this.optionsJson, []);
  }

  private onChange(event: Event) {
    this.value = (event.target as HTMLInputElement).value;
    this.dispatchEvent(
      new CustomEvent('change', {
        detail: { value: this.value },
        bubbles: true,
        composed: true,
      })
    );
  }

  firstUpdated() {
    this.defaultValue = this.value;
  }

  formResetCallback() {
    this.value = this.defaultValue;
  }

  formStateRestoreCallback(state: string | File | FormData | null) {
    if (typeof state === 'string') this.value = state;
  }

  focus(options?: FocusOptions) {
    this.shadowRoot
      ?.querySelector<HTMLInputElement>('input:checked, input:not(:disabled)')
      ?.focus(options);
  }

  render() {
    return html`
      <div class="group">
        ${this.mergedOptions.map(
          (option) => html`
            <label>
              <input
                type="radio"
                name=${this.name}
                value=${option.value}
                .checked=${this.value === option.value}
                ?disabled=${this.disabled || Boolean(option.disabled)}
                @change=${this.onChange}
              />
              <span>${option.label}</span>
            </label>
          `
        )}
      </div>
    `;
  }
}

export type { RadioOption };
