import { LitElement, css, html, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { FormValueController, formNameConverter } from '../../_shared/form';
import { baseControlStyles, focusRingStyles } from '../../_shared/styles';

@customElement('su-date-range')
export class SuDateRange extends LitElement {
  static formAssociated = true;
  @property({ type: String, reflect: true, converter: formNameConverter }) name = '';
  @property({ type: Array, attribute: false }) value: [string, string] = ['', ''];
  @property({ type: String }) label = '日期范围';
  @property({ type: String }) min = '';
  @property({ type: String }) max = '';
  @property({ type: Boolean }) required = false;
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ type: Boolean }) readonly = false;
  private initial: [string, string] = ['', ''];
  private readonly formValue = new FormValueController(this, () => {
    const data = new FormData();
    if (this.name && !this.formValue.disabled) {
      data.append(this.name, this.value[0] || '');
      data.append(this.name, this.value[1] || '');
    }
    return data;
  });
  static styles = [
    baseControlStyles,
    focusRingStyles,
    css`
      :host {
        display: block;
      }
      .range {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
      }
      label {
        display: grid;
        gap: 6px;
        color: var(--su-text-2);
      }
      input {
        font: inherit;
        color: var(--su-text-1);
        background: var(--su-bg-card);
        border: 1px solid var(--su-border-color);
        border-radius: var(--su-radius-sm);
        padding: 8px;
      }
      input[aria-invalid='true'] {
        border-color: var(--su-color-error);
      }
    `,
  ];
  firstUpdated() {
    this.initial = [...this.value];
  }
  formDisabledCallback(disabled: boolean) {
    this.formValue.setDisabled(disabled);
  }
  formResetCallback() {
    this.value = [...this.initial];
  }
  formStateRestoreCallback(state: string | File | FormData | null) {
    if (state instanceof FormData) {
      const values = state.getAll(this.name);
      this.value = [String(values[0] ?? ''), String(values[1] ?? '')];
    }
  }
  focus(options?: FocusOptions) {
    this.shadowRoot?.querySelector('input')?.focus(options);
  }
  private change(event: Event, index: number) {
    if (this.formValue.disabled || this.readonly) return;
    const value: [string, string] = [...this.value];
    value[index] = (event.target as HTMLInputElement).value;
    this.value = value;
    this.dispatchEvent(
      new CustomEvent('change', { detail: { value: [...value] }, bubbles: true, composed: true })
    );
  }
  protected updated() {
    const end = this.shadowRoot?.querySelector<HTMLInputElement>('#end');
    end?.setCustomValidity(
      this.value[0] && this.value[1] && this.value[0] > this.value[1]
        ? '结束日期不能早于开始日期'
        : ''
    );
    this.formValue.sync();
  }
  render() {
    return html`<div class="range" role="group" aria-label=${this.label}>
      ${[0, 1].map(
        (index) =>
          html`<label
            >${this.label} · ${index ? '结束' : '开始'}
            <input
              id=${index ? 'end' : 'start'}
              type="date"
              .value=${this.value[index] || ''}
              min=${this.min || nothing}
              max=${this.max || nothing}
              ?required=${this.required}
              ?disabled=${this.formValue.disabled}
              ?readonly=${this.readonly}
              @change=${(event: Event) => this.change(event, index)}
            />
          </label>`
      )}
    </div>`;
  }
}
