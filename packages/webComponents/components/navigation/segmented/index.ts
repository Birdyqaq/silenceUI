import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { baseControlStyles, focusRingStyles } from '../../_shared/styles';

export interface SegmentedOption {
  value: string;
  label: string;
  disabled?: boolean;
}

@customElement('su-segmented')
export class SuSegmented extends LitElement {
  @property({ attribute: false }) options: SegmentedOption[] = [];
  @property() value = '';
  @property() label = '视图';
  @property({ type: Boolean }) disabled = false;

  static styles = [
    baseControlStyles,
    focusRingStyles,
    css`
      div {
        display: inline-flex;
        flex-wrap: wrap;
        gap: 4px;
      }
      button {
        font: inherit;
        color: var(--su-text-1);
        background: var(--su-bg-card);
        border: 1px solid var(--su-border-color);
        border-radius: var(--su-radius-sm);
        padding: 4px 10px;
      }
      button[aria-checked='true'] {
        border-color: var(--su-color-primary);
      }
      button:disabled {
        opacity: 0.6;
      }
    `,
  ];

  private select(value: string) {
    if (
      this.disabled ||
      value === this.value ||
      !this.options.some((option) => option.value === value && !option.disabled)
    )
      return;
    this.value = value;
    this.dispatchEvent(
      new CustomEvent('change', { detail: { value }, bubbles: true, composed: true })
    );
  }

  private navigate(event: KeyboardEvent) {
    const buttons = [
      ...this.renderRoot.querySelectorAll<HTMLButtonElement>('button:not(:disabled)'),
    ];
    const current = buttons.indexOf(event.target as HTMLButtonElement);
    if (this.disabled || current === -1) return;
    let next: number;
    switch (event.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        next = (current + 1) % buttons.length;
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
        next = (current + buttons.length - 1) % buttons.length;
        break;
      case 'Home':
        next = 0;
        break;
      case 'End':
        next = buttons.length - 1;
        break;
      default:
        return;
    }
    event.preventDefault();
    buttons[next].focus();
    this.select(buttons[next].value);
  }

  render() {
    const enabled = this.options.filter((option) => !option.disabled);
    const tabStop = enabled.find((option) => option.value === this.value) ?? enabled[0];
    return html`<div role="radiogroup" aria-label=${this.label} @keydown=${this.navigate}>
      ${this.options.map(
        (option) =>
          html` <button
            type="button"
            role="radio"
            .value=${option.value}
            aria-checked=${option.value === this.value}
            tabindex=${!this.disabled && option === tabStop ? 0 : -1}
            ?disabled=${this.disabled || option.disabled}
            @click=${() => this.select(option.value)}
          >
            ${option.label}
          </button>`
      )}
    </div>`;
  }
}
declare global {
  interface HTMLElementTagNameMap {
    'su-segmented': SuSegmented;
  }
}
