import { LitElement, html, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { FormValueController, formNameConverter } from '../../_shared/form';
import { baseControlStyles, focusRingStyles } from '../../_shared/styles';
import { timeError, timeMinutes, timeStyles } from '../../_shared/time';

export type TimeRangeValue = [string, string];

@customElement('su-time-range')
export class SuTimeRange extends LitElement {
  static formAssociated = true;
  @property({ attribute: false }) value: TimeRangeValue = ['', ''];
  @property({ type: String, reflect: true, converter: formNameConverter }) name = '';
  @property({ type: String }) label = '时间范围';
  @property({ type: String }) min = '';
  @property({ type: String }) max = '';
  @property({ type: Number }) step = 60;
  @property({ type: Boolean }) required = false;
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ type: Boolean }) readonly = false;
  private initial: TimeRangeValue = ['', ''];
  private readonly formValue = new FormValueController(this, () => {
    const data = new FormData();
    if (this.name && !this.formValue.disabled)
      this.times.forEach((value) => data.append(this.name, value));
    return data;
  });
  static styles = [baseControlStyles, focusRingStyles, timeStyles];
  private get times(): TimeRangeValue {
    return [0, 1].map((i) =>
      Array.isArray(this.value) && typeof this.value[i] === 'string' ? this.value[i] : ''
    ) as TimeRangeValue;
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
    const next: TimeRangeValue = [...this.times];
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
      this.value.every((v) => typeof v === 'string');
    const times = this.times;
    this.shadowRoot?.querySelectorAll('input').forEach((input, index) => {
      let message = shape
        ? timeError(times[index], this.min, this.max, this.step)
        : '时间范围必须是两个时间字符串的数组';
      if (!message && Boolean(times[0]) !== Boolean(times[1]) && !times[index])
        message = '请完整填写起止时间';
      if (
        !message &&
        index === 1 &&
        times.every((t) => timeMinutes(t) !== null) &&
        times[0] > times[1]
      )
        message = '结束时间不能早于开始时间，不支持跨日';
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
              type="time"
              .value=${timeMinutes(this.times[index]) === null ? '' : this.times[index]}
              min=${timeMinutes(this.min) === null ? nothing : this.min}
              max=${timeMinutes(this.max) === null ? nothing : this.max}
              step=${Number.isSafeInteger(this.step) && this.step >= 60 && this.step % 60 === 0
                ? this.step
                : 60}
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
    'su-time-range': SuTimeRange;
  }
}
