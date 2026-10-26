import { LitElement, css, html, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { baseControlStyles } from '../../_shared/styles';
import { getFormController } from '../../_shared/form';

@customElement('su-form-item')
export class SuFormItem extends LitElement {
  @property({ type: String }) label = '';
  @property({ type: String }) message = '';
  @property({ type: String }) status: 'default' | 'error' | 'warning' | 'success' = 'default';
  @property({ type: Boolean }) required = false;

  static styles = [
    baseControlStyles,
    css`
      :host {
        display: block;
      }

      .item {
        display: grid;
        gap: 6px;
      }

      .label {
        font-size: var(--su-font-size-sm);
        color: var(--su-text-2);
      }

      .required {
        color: var(--su-color-error);
        margin-right: 4px;
      }

      .message {
        font-size: var(--su-font-size-xs);
      }

      .message.default {
        color: var(--su-text-3);
      }

      .message.error {
        color: var(--su-color-error);
      }

      .message.warning {
        color: var(--su-color-warning);
      }

      .message.success {
        color: var(--su-color-success);
      }
    `,
  ];

  updated() {
    this.querySelectorAll<HTMLElement>('*').forEach((field) => {
      if (field.closest('su-form-item') === this) getFormController(field)?.sync();
    });
  }

  render() {
    return html`
      <div class="item">
        ${this.label
          ? html`<label class="label"
              >${this.required ? html`<span class="required">*</span>` : nothing}${this
                .label}</label
            >`
          : nothing}
        <slot @slotchange=${() => this.updated()}></slot>
        ${this.message ? html`<div class="message ${this.status}">${this.message}</div>` : nothing}
      </div>
    `;
  }
}
