import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { baseControlStyles, focusRingStyles } from '../../_shared/styles';
import { parseJsonArray } from '../../_shared/utils';

interface SelectOption {
  label: string;
  value: string | number;
  disabled?: boolean;
}

@customElement('su-select')
export class SuSelect extends LitElement {
  @property({ type: Array, attribute: false }) options: SelectOption[] = [];
  @property({ type: String }) optionsJson = '';
  @property({ type: String }) value = '';
  @property({ type: String }) placeholder = '请选择';
  @property({ type: Boolean }) disabled = false;

  static styles = [
    baseControlStyles,
    focusRingStyles,
    css`
      :host {
        display: block;
      }

      .select {
        width: 100%;
        border: 1px solid var(--su-border-color);
        border-radius: var(--su-radius-sm);
        padding: 8px 10px;
        font-size: var(--su-font-size-md);
        color: var(--su-text-1);
        background: var(--su-bg-card);
      }

      .select:hover {
        border-color: var(--su-border-color-hover);
      }

      .select:disabled {
        color: var(--su-text-3);
        cursor: not-allowed;
        background: var(--su-bg-muted);
      }
    `
  ];

  private get mergedOptions(): SelectOption[] {
    if (this.options.length > 0) return this.options;
    return parseJsonArray<SelectOption>(this.optionsJson, []);
  }

  private handleChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.value = target.value;
    this.dispatchEvent(
      new CustomEvent('change', {
        detail: { value: this.value },
        bubbles: true,
        composed: true
      })
    );
  }

  render() {
    return html`
      <select class="select" .value=${this.value} ?disabled=${this.disabled} @change=${this.handleChange}>
        <option value="">${this.placeholder}</option>
        ${this.mergedOptions.map(
          (option) =>
            html`<option value=${String(option.value)} ?disabled=${Boolean(option.disabled)}>
              ${option.label}
            </option>`
        )}
      </select>
    `;
  }
}

export type { SelectOption };
