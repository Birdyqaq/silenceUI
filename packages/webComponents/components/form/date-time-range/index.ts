import { LitElement, html, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { FormValueController, formNameConverter } from '../../_shared/form';
import { baseControlStyles, focusRingStyles } from '../../_shared/styles';
import { timeStyles } from '../../_shared/time';
import { dateTimeError, isValidDateTime } from '../../_shared/date-time';

export type DateTimeRangeValue = [string, string];

@customElement('su-date-time-range')
export class SuDateTimeRange extends LitElement {
  static formAssociated = true;
  @property({ attribute: false }) value: DateTimeRangeValue = ['', ''];
  @property({ type: String, reflect: true, converter: formNameConverter }) name = '';
  @property({ type: String }) label = '日期时间范围';
  @property({ type: String }) min = '';
  @property({ type: String }) max = '';
  @property({ type: Boolean }) required = false;
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ type: Boolean }) readonly = false;
  private initial: DateTimeRangeValue = ['', ''];
  private readonly formValue = new FormValueController(this, () => {
    const data = new FormData();
    if (this.name && !this.formValue.disabled)
      this.times.forEach((value) => data.append(this.name, value));
    return data;
  });
  static styles = [baseControlStyles, focusRingStyles, timeStyles];
  private get times(): DateTimeRangeValue {
    return [0, 1].map((i) =>
      Array.isArray(this.value) && typeof this.value[i] === 'string' ? this.value[i] : ''
    ) as DateTimeRangeValue;
  }
  firstUpdated() {
    this.initial = [...this.times];
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
      (c) => !c.disabled
    );
    (controls.find((c) => c.willValidate && !c.validity.valid) ?? controls[0])?.focus(options);
  }
  private change(event: Event, index: number) {
    event.stopPropagation();
    const input = event.target as HTMLInputElement;
    if (
      this.formValue.disabled ||
      this.readonly ||
      !this.isConnected ||
      input !== this.shadowRoot?.querySelectorAll('input')[index]
    )
      return;
    const next: DateTimeRangeValue = [...this.times];
    if (next[index] === input.value) return;
    next[index] = input.value;
    this.value = next;
    this.dispatchEvent(
      new CustomEvent('change', { detail: { value: [...next] }, bubbles: true, composed: true })
    );
  }
  protected updated() {
    const shape =
      Array.isArray(this.value) &&
      this.value.length === 2 &&
      Array.from(this.value).every((v) => typeof v === 'string');
    const times = this.times;
    this.shadowRoot?.querySelectorAll('input').forEach((input, index) => {
      let message = shape
        ? dateTimeError(times[index], this.min, this.max)
        : '日期时间范围必须是两个日期时间字符串的数组';
      if (!message && Boolean(times[0]) !== Boolean(times[1]) && !times[index])
        message = '请完整填写起止日期时间';
      if (!message && index === 1 && times.every(isValidDateTime) && times[0] > times[1])
        message = '结束日期时间不能早于开始日期时间';
      input.setCustomValidity(message);
    });
    this.formValue.sync();
  }
  render() {
    return html`<div class="fields" role="group" aria-label=${this.label}>
      ${[0, 1].map(
        (index) =>
          html`<label
            >${this.label} · ${index ? '结束' : '开始'}<input
              type="datetime-local"
              part=${index ? 'end-control' : 'start-control'}
              .value=${isValidDateTime(this.times[index]) ? this.times[index] : ''}
              min=${isValidDateTime(this.min) ? this.min : nothing}
              max=${isValidDateTime(this.max) ? this.max : nothing}
              step="60"
              ?required=${this.required}
              ?disabled=${this.formValue.disabled}
              ?readonly=${this.readonly}
              @change=${(event: Event) => this.change(event, index)}
          /></label>`
      )}
    </div>`;
  }
}
declare global {
  interface HTMLElementTagNameMap {
    'su-date-time-range': SuDateTimeRange;
  }
}
