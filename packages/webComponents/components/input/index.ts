import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('su-input')
export class SeInput extends LitElement {
  @property({ type: String }) value: string = '';
  @property({ type: String }) placeholder: string = 'Enter text';
  @property({ type: Boolean }) disabled: boolean = false;
  @property({ type: String }) type: string = 'text'; // 'text', 'password', 'email', etc.
  @property({ type: Boolean }) readonly: boolean = false;
  @property({ type: Boolean }) error: boolean = false; // 错误状态
  @property({ type: String }) label: string = ''; // 输入框标签
  @property({ type: String }) helperText: string = ''; // 辅助文本

  static styles = css`
    :host {
      display: block;
      font-family: Arial, sans-serif;
    }

    .input-container {
      display: flex;
      flex-direction: column;
      gap: 4px;
      width: 100%;
    }

    .label {
      font-size: 14px;
      font-weight: 500;
      color: var(--text-color, #333);
    }

    .input-wrapper {
      position: relative;
      display: flex;
      align-items: center;
    }

    input {
      width: 100%;
      padding: 10px 12px;
      font-size: 14px;
      border: 1px solid var(--border-color, #ccc);
      border-radius: 4px;
      outline: none;
      transition: border-color 0.3s, box-shadow 0.3s;
      background-color: var(--background-color, #fff);
      color: var(--text-color, #333);
    }

    input:focus {
      border-color: var(--primary-color, #007bff);
      box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.2);
    }

    input:disabled {
      background-color: var(--disabled-bg-color, #f5f5f5);
      border-color: var(--disabled-border-color, #ddd);
      color: var(--disabled-text-color, #aaa);
      cursor: not-allowed;
    }

    input.error {
      border-color: var(--error-color, #dc3545);
      background-color: var(--error-bg-color, #fff5f5);
    }

    .helper-text {
      font-size: 12px;
      color: var(--helper-text-color, #666);
    }

    .helper-text.error {
      color: var(--error-color, #dc3545);
    }
  `;

  handleInput(event: Event) {
    const input = event.target as HTMLInputElement;
    this.value = input.value;
    this.dispatchEvent(new CustomEvent('input-change', { detail: { value: this.value } }));
  }

  render() {
    return html`
      <div class="input-container">
        ${this.label
        ? html`<label class="label" for="input">${this.label}</label>`
        : ''}
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
        </div>
        ${this.helperText
        ? html`<span class="helper-text ${this.error ? 'error' : ''}">
              ${this.helperText}
            </span>`
        : ''}
      </div>
    `;
  }
}

export * from './index';