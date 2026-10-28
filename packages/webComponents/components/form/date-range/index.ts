import { LitElement, css, html, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { FormValueController, formNameConverter } from '../../_shared/form';
import { baseControlStyles, focusRingStyles } from '../../_shared/styles';
import { isValidDateValue } from '../../_shared/date';

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
      this.dates.forEach((value) => data.append(this.name, value));
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
  /** Keep rendering safe for untyped consumers; invalid input is reported rather than silently accepted. */
  private get dates(): [string, string] {
    return [0, 1].map((index) =>
      Array.isArray(this.value) && typeof this.value[index] === 'string' ? this.value[index] : ''
    ) as [string, string];
  }
  firstUpdated() {
    this.initial = [...this.dates];
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
      this.value = [
        typeof values[0] === 'string' ? values[0] : '',
        typeof values[1] === 'string' ? values[1] : '',
      ];
    }
  }
  focus(options?: FocusOptions) {
    const controls = Array.from(this.shadowRoot?.querySelectorAll('input') ?? []).filter(
      (control) => !control.disabled
    );
    (
      controls.find((control) => control.willValidate && !control.validity.valid) ?? controls[0]
    )?.focus(options);
  }
  private change(event: Event, index: number) {
    if (this.formValue.disabled || this.readonly) return;
    const value: [string, string] = [...this.dates];
    value[index] = (event.target as HTMLInputElement).value;
    this.value = value;
    this.dispatchEvent(
      new CustomEvent('change', { detail: { value: [...value] }, bubbles: true, composed: true })
    );
  }
  protected updated() {
    const dates = this.dates;
    const validShape =
      Array.isArray(this.value) &&
      this.value.length === 2 &&
      this.value.every((value) => typeof value === 'string');
    this.shadowRoot?.querySelectorAll('input').forEach((control, index) => {
      let message = !validShape
        ? '日期范围必须是包含两个日期字符串的数组'
        : dates[index] && !isValidDateValue(dates[index])
          ? `${index ? '结束' : '开始'}日期格式无效，请使用 YYYY-MM-DD`
          : '';
      if (!message && index === 1 && dates.every(isValidDateValue) && dates[0] > dates[1])
        message = '结束日期不能早于开始日期';
      control.setCustomValidity(message);
    });
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
              .value=${isValidDateValue(this.dates[index]) ? this.dates[index] : ''}
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
