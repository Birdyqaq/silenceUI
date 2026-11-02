import { LitElement, html, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { FormValueController, formNameConverter } from '../../_shared/form';
import { baseControlStyles, focusRingStyles } from '../../_shared/styles';
import { timeError, timeMinutes, timeStyles } from '../../_shared/time';

@customElement('su-time-picker')
export class SuTimePicker extends LitElement {
  static formAssociated = true;
  @property({ type: String }) value = '';
  @property({ type: String, reflect: true, converter: formNameConverter }) name = '';
  @property({ type: String }) label = '时间';
  @property({ type: String }) min = '';
  @property({ type: String }) max = '';
  @property({ type: Number }) step = 60;
  @property({ type: Boolean }) required = false;
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ type: Boolean }) readonly = false;
  private initial = '';
  private readonly formValue: FormValueController = new FormValueController(this, () =>
    this.formValue.disabled ? null : typeof this.value === 'string' ? this.value : ''
  );
  static styles = [baseControlStyles, focusRingStyles, timeStyles];

  firstUpdated() {
    this.initial = this.value;
  }
  formDisabledCallback(disabled: boolean) {
    this.formValue.setDisabled(disabled);
  }
  formResetCallback() {
    this.value = this.initial;
  }
  formStateRestoreCallback(state: string | File | FormData | null) {
    if (typeof state === 'string') this.value = state;
  }
  focus(options?: FocusOptions) {
    this.shadowRoot?.querySelector('input')?.focus(options);
  }
  private change(event: Event) {
    event.stopPropagation();
    const input = event.target as HTMLInputElement;
    if (
      this.formValue.disabled ||
      this.readonly ||
      !this.isConnected ||
      input !== this.shadowRoot?.querySelector('input')
    )
      return;
    if (input.value === this.value) return;
    this.value = input.value;
    this.dispatchEvent(
      new CustomEvent('change', { detail: { value: this.value }, bubbles: true, composed: true })
    );
  }
  protected updated() {
    this.shadowRoot
      ?.querySelector('input')
      ?.setCustomValidity(timeError(this.value, this.min, this.max, this.step));
    this.formValue.sync();
  }
  render() {
    return html`<label
      >${this.label}<input
        type="time"
        aria-label=${this.label || '时间'}
        .value=${timeMinutes(this.value) === null ? '' : this.value}
        min=${timeMinutes(this.min) === null ? nothing : this.min}
        max=${timeMinutes(this.max) === null ? nothing : this.max}
        step=${Number.isSafeInteger(this.step) && this.step >= 60 && this.step % 60 === 0
          ? this.step
          : 60}
        ?required=${this.required}
        ?disabled=${this.formValue.disabled}
        ?readonly=${this.readonly}
        @change=${this.change}
    /></label>`;
  }
}
declare global {
  interface HTMLElementTagNameMap {
    'su-time-picker': SuTimePicker;
  }
}
