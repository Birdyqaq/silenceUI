import { LitElement, css, html, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { formNameConverter, FormValueController } from '../../_shared/form';
import { baseControlStyles, focusRingStyles } from '../../_shared/styles';

@customElement('su-textarea')
export class SuTextarea extends LitElement {
  static formAssociated = true;

  @property({ type: String }) value = '';
  @property({ type: String, reflect: true, converter: formNameConverter }) name = '';
  @property({ type: String }) placeholder = '请输入';
  @property({ type: Number }) rows = 4;
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ type: Boolean }) readonly = false;
  @property({ type: String }) label = '';
  @property({ type: String }) helperText = '';
  @property({ type: Boolean }) error = false;

  private defaultValue = '';
  private readonly formValue: FormValueController = new FormValueController(this, () =>
    this.formValue.disabled ? null : this.value
  );

  static styles = [
    baseControlStyles,
    focusRingStyles,
    css`
      :host {
        display: block;
      }

      .field {
        display: grid;
        gap: 6px;
      }

      label {
        font-size: var(--su-font-size-sm);
        color: var(--su-text-2);
      }

      .helper {
        font-size: var(--su-font-size-xs);
        color: var(--su-text-3);
      }

      .helper.error {
        color: var(--su-color-error);
      }

      textarea {
        width: 100%;
        border: 1px solid var(--su-border-color);
        border-radius: var(--su-radius-sm);
        padding: 10px 12px;
        font-size: var(--su-font-size-md);
        color: var(--su-text-1);
        background: var(--su-bg-card);
        resize: vertical;
      }

      textarea:hover {
        border-color: var(--su-border-color-hover);
      }

      textarea:focus {
        border-color: var(--su-color-primary);
        box-shadow: 0 0 0 3px rgba(var(--su-color-primary-rgb), 0.16);
        outline: none;
      }

      textarea:disabled {
        color: var(--su-text-3);
        background: var(--su-bg-muted);
        cursor: not-allowed;
      }

      textarea[aria-invalid='true'] {
        border-color: var(--su-color-error);
      }
    `,
  ];

  private handleInput(event: Event) {
    this.value = (event.target as HTMLTextAreaElement).value;
    this.dispatchEvent(
      new CustomEvent('input-change', {
        detail: { value: this.value },
        bubbles: true,
        composed: true,
      })
    );
  }

  firstUpdated() {
    this.defaultValue = this.value;
  }

  /** 原生 fieldset 禁用变化同步到内部控件，保留自身 disabled。 */
  formDisabledCallback(disabled: boolean) {
    this.formValue.setDisabled(disabled);
  }

  formResetCallback() {
    this.value = this.defaultValue;
  }

  formStateRestoreCallback(state: string | File | FormData | null) {
    if (typeof state === 'string') this.value = state;
  }

  focus(options?: FocusOptions) {
    this.shadowRoot?.querySelector('textarea')?.focus(options);
  }

  render() {
    return html`
      <div class="field">
        ${this.label ? html`<label for="textarea">${this.label}</label>` : nothing}
        <textarea
          id="textarea"
          .value=${this.value}
          placeholder=${this.placeholder}
          rows=${this.rows}
          ?disabled=${this.formValue.disabled}
          ?readonly=${this.readonly}
          aria-invalid=${String(this.error)}
          aria-describedby=${this.helperText ? 'helper-text' : nothing}
          @input=${this.handleInput}
        ></textarea>
        ${this.helperText
          ? html`<span id="helper-text" class="helper ${this.error ? 'error' : ''}"
              >${this.helperText}</span
            >`
          : nothing}
      </div>
    `;
  }
}
