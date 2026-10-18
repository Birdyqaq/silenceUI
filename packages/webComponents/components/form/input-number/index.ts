import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { FormValueController } from '../../_shared/form';
import { baseControlStyles, focusRingStyles } from '../../_shared/styles';

@customElement('su-input-number')
export class SuInputNumber extends LitElement {
  static formAssociated = true;

  @property({ type: Number }) value = 0;
  @property({ type: String }) name = '';
  @property({ type: Number }) min = Number.MIN_SAFE_INTEGER;
  @property({ type: Number }) max = Number.MAX_SAFE_INTEGER;
  @property({ type: Number }) step = 1;
  @property({ type: Boolean, reflect: true }) disabled = false;

  private defaultValue = 0;
  private readonly formValue = new FormValueController(this, () =>
    this.disabled ? null : String(this.value)
  );

  static styles = [
    baseControlStyles,
    focusRingStyles,
    css`
      :host {
        display: inline-block;
      }

      .wrapper {
        display: inline-flex;
        align-items: stretch;
        border: 1px solid var(--su-border-color);
        border-radius: var(--su-radius-sm);
        overflow: hidden;
        background: var(--su-bg-card);
      }

      .wrapper:hover {
        border-color: var(--su-border-color-hover);
      }

      .wrapper:focus-within {
        border-color: var(--su-color-primary);
        box-shadow: 0 0 0 3px rgba(var(--su-color-primary-rgb), 0.16);
      }

      button {
        width: 30px;
        border: none;
        background: var(--su-bg-muted);
        color: var(--su-text-2);
        cursor: pointer;
        font-size: var(--su-font-size-md);
      }

      button:hover:not(:disabled) {
        color: var(--su-color-primary);
      }

      button:disabled {
        color: var(--su-text-3);
        cursor: not-allowed;
        opacity: 0.6;
      }

      input {
        width: 64px;
        border: none;
        outline: none;
        text-align: center;
        font-size: var(--su-font-size-md);
        color: var(--su-text-1);
        background: transparent;
        padding: 8px 4px;
        -moz-appearance: textfield;
      }

      input::-webkit-outer-spin-button,
      input::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
      }

      input:disabled {
        color: var(--su-text-3);
        cursor: not-allowed;
      }
    `,
  ];

  private clamp(value: number) {
    return Math.min(this.max, Math.max(this.min, Number.isFinite(value) ? value : 0));
  }

  /** 外部赋值与边界更新同样归一化，不派发用户交互事件。 */
  protected willUpdate() {
    if (!Number.isFinite(this.min)) this.min = Number.MIN_SAFE_INTEGER;
    if (!Number.isFinite(this.max)) this.max = Number.MAX_SAFE_INTEGER;
    if (this.max < this.min) this.max = this.min;
    this.value = this.clamp(this.value);
  }

  /** 使用输入值的小数位精度消除常见十进制步进浮点尾数。 */
  private stepValue(direction: number) {
    const precision = (value: number) => {
      const [coefficient, exponent = '0'] = String(value).toLowerCase().split('e');
      return Math.max(0, (coefficient.split('.')[1]?.length ?? 0) - Number(exponent));
    };
    const digits = Math.min(100, Math.max(precision(this.value), precision(this.safeStep)));
    this.emitChange(Number((this.value + direction * this.safeStep).toFixed(digits)));
  }

  private get safeStep() {
    return Number.isFinite(this.step) && this.step > 0 ? this.step : 1;
  }

  private emitChange(next: number) {
    if (this.disabled) return;
    const clamped = this.clamp(next);
    if (clamped === this.value) {
      this.requestUpdate();
      return;
    }
    this.value = clamped;
    this.dispatchEvent(
      new CustomEvent('change', {
        detail: { value: this.value },
        bubbles: true,
        composed: true,
      })
    );
  }

  private onInput(event: Event) {
    const raw = (event.target as HTMLInputElement).value;
    const parsed = Number(raw);
    if (raw === '' || Number.isNaN(parsed)) return;
    this.emitChange(parsed);
  }

  private onBlur(event: Event) {
    const input = event.target as HTMLInputElement;
    input.value = String(this.value);
  }

  firstUpdated() {
    this.defaultValue = this.value;
  }

  formResetCallback() {
    this.value = this.defaultValue;
  }

  formStateRestoreCallback(state: string | File | FormData | null) {
    if (typeof state !== 'string') return;
    const restored = Number(state);
    if (!Number.isNaN(restored)) this.value = this.clamp(restored);
  }

  focus(options?: FocusOptions) {
    this.shadowRoot?.querySelector('input')?.focus(options);
  }

  render() {
    return html`
      <div class="wrapper">
        <button
          type="button"
          aria-label="减少"
          ?disabled=${this.disabled || this.value <= this.min}
          @click=${() => this.stepValue(-1)}
        >
          −
        </button>
        <input
          type="number"
          .value=${String(this.value)}
          .min=${String(this.min)}
          .max=${String(this.max)}
          .step=${String(this.safeStep)}
          ?disabled=${this.disabled}
          @change=${this.onInput}
          @blur=${this.onBlur}
        />
        <button
          type="button"
          aria-label="增加"
          ?disabled=${this.disabled || this.value >= this.max}
          @click=${() => this.stepValue(1)}
        >
          +
        </button>
      </div>
    `;
  }
}
