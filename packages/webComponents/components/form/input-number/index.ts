import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { baseControlStyles, focusRingStyles } from '../../_shared/styles';

@customElement('su-input-number')
export class SuInputNumber extends LitElement {
  @property({ type: Number }) value = 0;
  @property({ type: Number }) min = Number.MIN_SAFE_INTEGER;
  @property({ type: Number }) max = Number.MAX_SAFE_INTEGER;
  @property({ type: Number }) step = 1;
  @property({ type: Boolean }) disabled = false;

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
    `
  ];

  private clamp(value: number) {
    return Math.min(this.max, Math.max(this.min, value));
  }

  private emitChange(next: number) {
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
        composed: true
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

  render() {
    return html`
      <div class="wrapper">
        <button
          type="button"
          aria-label="减少"
          ?disabled=${this.disabled || this.value <= this.min}
          @click=${() => this.emitChange(this.value - this.step)}>
          −
        </button>
        <input
          type="number"
          .value=${String(this.value)}
          ?disabled=${this.disabled}
          @change=${this.onInput}
          @blur=${this.onBlur} />
        <button
          type="button"
          aria-label="增加"
          ?disabled=${this.disabled || this.value >= this.max}
          @click=${() => this.emitChange(this.value + this.step)}>
          +
        </button>
      </div>
    `;
  }
}
