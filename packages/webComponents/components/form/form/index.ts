import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { getFormController } from '../../_shared/form';

export interface FormRule {
  required?: boolean;
  message?: string;
  validator?: (
    value: unknown,
    values: Record<string, unknown>
  ) => string | void | Promise<string | void>;
}
type Field = HTMLElement & {
  value?: unknown;
  checked?: boolean;
  disabled?: boolean;
  updateComplete?: Promise<unknown>;
};

/** Owns validation; the consumer supplies a light-DOM native form for browser submission/reset semantics. */
@customElement('su-form')
export class SuForm extends LitElement {
  @property({ type: Object, attribute: false }) rules: Record<string, FormRule[]> = {};
  @property({ type: Object, attribute: false }) errors: Record<string, string> = {};
  private validationRun = 0;

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener('submit', this.onSubmit);
    this.addEventListener('reset', this.onReset);
    this.addEventListener('input', this.onEdit);
    this.addEventListener('change', this.onEdit);
    this.addEventListener('input-change', this.onEdit);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.validationRun++;
    this.removeEventListener('submit', this.onSubmit);
    this.removeEventListener('reset', this.onReset);
    this.removeEventListener('input', this.onEdit);
    this.removeEventListener('change', this.onEdit);
    this.removeEventListener('input-change', this.onEdit);
  }

  private get fields() {
    return Array.from(this.querySelectorAll<Field>('[name]')).filter(
      (field) =>
        field.closest('su-form') === this &&
        (getFormController(field) || field.matches('input,select,textarea'))
    );
  }

  private values() {
    const values: Record<string, unknown> = Object.create(null);
    this.fields.forEach((field) => {
      if (field.disabled || getFormController(field)?.disabled || field.matches(':disabled'))
        return;
      const name = field.getAttribute('name')!;
      const controller = getFormController(field);
      const submitted = controller ? controller.value : field.value;
      const value =
        submitted instanceof FormData
          ? submitted.getAll(name)
          : field instanceof HTMLSelectElement && field.multiple
            ? Array.from(field.selectedOptions, (option) => option.value)
            : field.matches('input[type="checkbox"],input[type="radio"]') && !field.checked
              ? ''
              : submitted;
      if (Object.prototype.hasOwnProperty.call(values, name))
        values[name] = [
          ...(Array.isArray(values[name]) ? (values[name] as unknown[]) : [values[name]]),
          value,
        ];
      else values[name] = value;
    });
    return values;
  }

  private applyErrors(errors: Record<string, string>) {
    this.errors = errors;
    this.fields.forEach((field) => {
      const name = field.getAttribute('name')!;
      const message = Object.prototype.hasOwnProperty.call(errors, name) ? errors[name] : '';
      getFormController(field)?.setCustomValidity(message);
      const item = field.closest('su-form-item') as
        | (HTMLElement & { message: string; status: string })
        | null;
      if (item) {
        item.message = message;
        item.status = message ? 'error' : 'default';
      }
      if (
        field instanceof HTMLInputElement ||
        field instanceof HTMLSelectElement ||
        field instanceof HTMLTextAreaElement
      ) {
        field.setCustomValidity(message);
        field.setAttribute('aria-invalid', String(Boolean(message)));
      }
    });
  }

  /** Invalidates pending asynchronous validators so stale results cannot overwrite newer edits. */
  private onEdit = () => {
    this.validationRun++;
    this.applyErrors({});
  };
  private onReset = () => {
    this.validationRun++;
    this.applyErrors({});
  };
  private onSubmit = (event: Event) => {
    event.preventDefault();
    event.stopPropagation();
    void this.validate().then((valid) => {
      if (valid && this.isConnected)
        this.dispatchEvent(
          new CustomEvent('valid-submit', {
            detail: { values: this.values() },
            bubbles: true,
            composed: true,
          })
        );
    });
  };

  /** Returns false for failed or superseded validation; focuses the first invalid field. */
  async validate(): Promise<boolean> {
    const run = ++this.validationRun;
    await Promise.all(this.fields.map((field) => field.updateComplete));
    if (run !== this.validationRun) return false;
    this.applyErrors({});
    const values = this.values();
    const errors: Record<string, string> = Object.create(null);
    for (const field of this.fields) {
      if (field.disabled || getFormController(field)?.disabled || field.matches(':disabled'))
        continue;
      const name = field.getAttribute('name')!;
      const value = values[name];
      for (const rule of Object.prototype.hasOwnProperty.call(this.rules, name)
        ? this.rules[name]
        : []) {
        const empty = value == null || value === '' || (Array.isArray(value) && !value.length);
        let message = rule.required && empty ? rule.message || '此项必填' : '';
        if (!message && rule.validator) {
          try {
            message = (await rule.validator(value, values)) || '';
          } catch {
            message = rule.message || '校验失败，请重试';
          }
        }
        if (run !== this.validationRun || !this.isConnected) return false;
        if (message) {
          errors[name] = message;
          break;
        }
      }
      const controller = getFormController(field);
      const native = field as HTMLInputElement;
      if (!errors[name]) {
        const message = controller?.validationMessage ?? native.validationMessage;
        if (message) errors[name] = message;
      }
    }
    if (run !== this.validationRun) return false;
    this.applyErrors(errors);
    const first = this.fields.find((field) => errors[field.getAttribute('name')!]);
    first?.focus();
    this.dispatchEvent(
      new CustomEvent('validate', {
        detail: { valid: !first, errors: { ...errors } },
        bubbles: true,
        composed: true,
      })
    );
    return !first;
  }

  reset() {
    this.querySelector('form')?.reset();
    this.onReset();
  }
  render() {
    return html`<slot></slot>`;
  }
}
