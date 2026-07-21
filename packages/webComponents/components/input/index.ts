import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('su-input')
export class SeInput extends LitElement {
  @property({ type: String }) value = '';
  @property({ type: String }) placeholder = '请输入';
  @property({ type: Boolean }) disabled = false;
  @property({ type: String }) type = 'text';
  @property({ type: Boolean }) readonly = false;
  @property({ type: Boolean }) error = false;
  @property({ type: String }) label = '';
  @property({ type: String }) helperText = '';
  @property({ type: Boolean }) clearable = false;

  static styles = css`
    :host {
      display: block;
      font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
    }

    .input-container {
      display: flex;
      flex-direction: column;
      gap: 6px;
      width: 100%;
    }

    .label {
      font-size: var(--su-font-size-sm);
      font-weight: 500;
      color: var(--su-text-2);
    }

    .input-wrapper {
      position: relative;
      display: flex;
      align-items: center;
    }

    input {
      width: 100%;
      padding: 9px 12px;
      font-size: var(--su-font-size-md);
      border: 1px solid var(--su-border-color);
      border-radius: var(--su-radius-sm);
      outline: none;
      transition: border-color 0.2s, box-shadow 0.2s;
      background-color: var(--su-bg-card);
      color: var(--su-text-1);
    }

    input:hover {
      border-color: var(--su-border-color-hover);
    }

    input:focus {
      border-color: var(--su-color-primary);
      box-shadow: 0 0 0 3px rgba(var(--su-color-primary-rgb), 0.16);
    }

    input:disabled {
      background-color: var(--su-bg-muted);
      border-color: var(--su-border-color);
      color: var(--su-text-3);
      cursor: not-allowed;
    }

    input.error {
      border-color: var(--su-color-error);
      background-color: #fef2f2;
    }

    .clear-btn {
      position: absolute;
      right: 8px;
      background: transparent;
      border: none;
      cursor: pointer;
      color: var(--su-text-3);
      font-size: 14px;
      display: flex;
      align-items: center;
    }

    .clear-btn:hover {
      color: var(--su-text-1);
    }

    .helper-text {
      font-size: var(--su-font-size-xs);
      color: var(--su-text-3);
    }

    .helper-text.error {
      color: var(--su-color-error);
    }
  `;

  handleInput(event: Event) {
    const input = event.target as HTMLInputElement;
    this.value = input.value;
    this.dispatchEvent(new CustomEvent('input-change', { detail: { value: this.value } }));
  }

  private handleClear() {
    if (this.disabled || this.readonly) return;
    this.value = '';
    this.dispatchEvent(new CustomEvent('input-change', { detail: { value: this.value } }));
    const input = this.shadowRoot?.querySelector('input');
    input?.focus();
  }

  render() {
    return html`
      <div class="input-container">
        ${this.label ? html`<label class="label" for="input">${this.label}</label>` : ''}
        <div class="input-wrapper">
          <input
            id="input"
            class="${this.error ? 'error' : ''}"
            .value="${this.value}"
            .placeholder="${this.placeholder}"
            .type="${this.type}"
            ?disabled="${this.disabled}"
            ?readonly="${this.readonly}"
            @input="${this.handleInput}"
            aria-invalid="${this.error ? 'true' : 'false'}"
            aria-readonly="${this.readonly ? 'true' : 'false'}"
          />
          ${this.clearable && this.value
            ? html`<button class="clear-btn" type="button" @click="${this.handleClear}">✕</button>`
            : ''}
        </div>
        ${this.helperText
          ? html`<span class="helper-text ${this.error ? 'error' : ''}">${this.helperText}</span>`
          : ''}
      </div>
    `;
  }
}
