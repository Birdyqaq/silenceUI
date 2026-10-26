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
type FieldSnapshot = { field: Field; name: string; disabled: boolean; value: unknown };
type NativeField = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
type FormItem = HTMLElement & { message: string; status: string };

/** Arrays represent multi-value fields; File objects are compared by identity. */
function sameValue(left: unknown, right: unknown): boolean {
  return Array.isArray(left) && Array.isArray(right)
    ? left.length === right.length && left.every((value, index) => sameValue(value, right[index]))
    : Object.is(left, right);
}

/** Owns validation; the consumer supplies a light-DOM native form for browser submission/reset semantics. */
@customElement('su-form')
export class SuForm extends LitElement {
  @property({ type: Object, attribute: false }) rules: Record<string, FormRule[]> = {};
  @property({ type: Object, attribute: false }) errors: Record<string, string> = {};
  private validationRun = 0;
  private validated?: { run: number; snapshot: FieldSnapshot[]; values: Record<string, unknown> };
  private nativeErrors = new WeakMap<
    NativeField,
    { applied: string; original: string; aria: string | null }
  >();
  private itemErrors = new WeakMap<
    FormItem,
    { applied: string; message: string; status: string }
  >();

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
        Boolean(field.getAttribute('name')) &&
        field.closest('su-form') === this &&
        (getFormController(field) ||
          field.matches(
            'input:not([type="submit"]):not([type="reset"]):not([type="button"]):not([type="image"]),select,textarea'
          ))
    );
  }

  private snapshot(): FieldSnapshot[] {
    return this.fields.map((field) => {
      const name = field.getAttribute('name')!;
      const controller = getFormController(field);
      const submitted = controller ? controller.value : field.value;
      const value =
        submitted instanceof FormData
          ? submitted.getAll(name)
          : field instanceof HTMLSelectElement && field.multiple
            ? Array.from(field.selectedOptions, (option) => option.value)
            : field.matches('input[type="checkbox"],input[type="radio"]') && !field.checked
              ? null
              : field instanceof HTMLInputElement && field.type === 'file'
                ? Array.from(field.files ?? [])
                : submitted;
      return {
        field,
        name,
        value,
        disabled: Boolean(field.disabled || controller?.disabled || field.matches(':disabled')),
      };
    });
  }

  private values(snapshot = this.snapshot()) {
    const values: Record<string, unknown> = Object.create(null);
    snapshot.forEach(({ name, value, disabled }) => {
      if (disabled || value == null) return;
      if (Object.prototype.hasOwnProperty.call(values, name))
        values[name] = [
          ...(Array.isArray(values[name]) ? (values[name] as unknown[]) : [values[name]]),
          ...(Array.isArray(value) ? value : [value]),
        ];
      else values[name] = value;
    });
    return values;
  }

  private matchesSnapshot(snapshot: FieldSnapshot[]) {
    const current = this.snapshot();
    return (
      current.length === snapshot.length &&
      current.every((entry, index) => {
        const previous = snapshot[index];
        return (
          entry.field === previous.field &&
          entry.name === previous.name &&
          entry.disabled === previous.disabled &&
          sameValue(entry.value, previous.value)
        );
      })
    );
  }

  private applyErrors(errors: Record<string, string>) {
    this.errors = errors;
    this.fields.forEach((field) => {
      const name = field.getAttribute('name')!;
      const inactive =
        field.disabled || getFormController(field)?.disabled || field.matches(':disabled');
      const message =
        !inactive && Object.prototype.hasOwnProperty.call(errors, name) ? errors[name] : '';
      getFormController(field)?.setCustomValidity(message);
      const item = field.closest('su-form-item') as FormItem | null;
      if (item) {
        const previous = this.itemErrors.get(item);
        if (message) {
          const original =
            previous && previous.applied === item.message && item.status === 'error'
              ? previous
              : { message: item.message, status: item.status };
          this.itemErrors.set(item, { ...original, applied: message });
          item.message = message;
          item.status = 'error';
        } else if (previous) {
          if (item.message === previous.applied && item.status === 'error') {
            item.message = previous.message;
            item.status = previous.status;
          }
          this.itemErrors.delete(item);
        }
      }
      if (
        field instanceof HTMLInputElement ||
        field instanceof HTMLSelectElement ||
        field instanceof HTMLTextAreaElement
      ) {
        const previous = this.nativeErrors.get(field);
        const current = field.validity.customError ? field.validationMessage : '';
        if (message) {
          const original = previous && current === previous.applied ? previous.original : current;
          this.nativeErrors.set(field, {
            applied: message,
            original,
            aria: previous ? previous.aria : field.getAttribute('aria-invalid'),
          });
          field.setCustomValidity(message);
          field.setAttribute('aria-invalid', 'true');
        } else if (previous) {
          if (current === previous.applied) field.setCustomValidity(previous.original);
          if (field.getAttribute('aria-invalid') === 'true') {
            if (previous.aria == null) field.removeAttribute('aria-invalid');
            else field.setAttribute('aria-invalid', previous.aria);
          }
          this.nativeErrors.delete(field);
        }
      }
    });
  }

  /** Invalidates pending asynchronous validators so stale results cannot overwrite newer edits. */
  private onEdit = (event: Event) => {
    const field = event
      .composedPath()
      .find((target) => target instanceof HTMLElement && this.fields.includes(target as Field)) as
      | Field
      | undefined;
    if (!field) return;
    this.validationRun++;
    const errors = { ...this.errors };
    delete errors[field.getAttribute('name')!];
    this.applyErrors(errors);
  };
  private onReset = () => {
    this.validationRun++;
    this.applyErrors({});
  };
  private onSubmit = (event: Event) => {
    event.preventDefault();
    event.stopPropagation();
    const run = this.validationRun + 1;
    void this.validate().then((valid) => {
      const validated = this.validated;
      if (
        valid &&
        validated &&
        validated.run === run &&
        this.validationRun === run &&
        this.isConnected &&
        this.matchesSnapshot(validated.snapshot)
      )
        this.dispatchEvent(
          new CustomEvent('valid-submit', {
            detail: { values: validated.values },
            bubbles: true,
            composed: true,
          })
        );
    });
  };

  /** Returns false for failed or superseded validation; focuses the first invalid field. */
  async validate(): Promise<boolean> {
    const run = ++this.validationRun;
    this.validated = undefined;
    await Promise.all(this.fields.map((field) => field.updateComplete));
    if (run !== this.validationRun || !this.isConnected) return false;
    this.applyErrors({});
    const snapshot = this.snapshot();
    const values = this.values(snapshot);
    const rules = Object.fromEntries(
      Object.entries(this.rules).map(([name, entries]) => [
        name,
        entries.map((rule) => ({ ...rule })),
      ])
    );
    const unchanged = () => {
      if (run !== this.validationRun || !this.isConnected) return false;
      return (
        this.matchesSnapshot(snapshot) &&
        Object.keys(this.rules).length === Object.keys(rules).length &&
        Object.entries(rules).every(([name, entries]) => {
          const currentRules = Object.prototype.hasOwnProperty.call(this.rules, name)
            ? this.rules[name]
            : [];
          return (
            currentRules.length === entries.length &&
            entries.every(
              (rule, index) =>
                rule.required === currentRules[index].required &&
                rule.message === currentRules[index].message &&
                rule.validator === currentRules[index].validator
            )
          );
        })
      );
    };
    const errors: Record<string, string> = Object.create(null);
    const names = [
      ...new Set(snapshot.filter((entry) => !entry.disabled).map((entry) => entry.name)),
    ];
    for (const name of names) {
      const value = values[name];
      for (const rule of Object.prototype.hasOwnProperty.call(rules, name) ? rules[name] : []) {
        const empty = value == null || value === '' || (Array.isArray(value) && !value.length);
        let message = rule.required && empty ? rule.message || '此项必填' : '';
        if (!message && rule.validator) {
          try {
            message = (await rule.validator(value, values)) || '';
          } catch {
            message = rule.message || '校验失败，请重试';
          }
        }
        if (!unchanged()) return false;
        if (message) {
          errors[name] = message;
          break;
        }
      }
      if (!errors[name]) {
        for (const entry of snapshot.filter((entry) => entry.name === name && !entry.disabled)) {
          const native = entry.field as HTMLInputElement;
          const message =
            getFormController(entry.field)?.validationMessage ??
            (native.willValidate ? native.validationMessage : '');
          if (message) {
            errors[name] = message;
            break;
          }
        }
      }
    }
    if (!unchanged()) return false;
    this.applyErrors(errors);
    const first = snapshot.find((entry) => !entry.disabled && errors[entry.name])?.field;
    first?.focus();
    if (!first) this.validated = { run, snapshot, values };
    this.dispatchEvent(
      new CustomEvent('validate', {
        detail: { valid: !first, errors: { ...errors } },
        bubbles: true,
        composed: true,
      })
    );
    return !first && unchanged();
  }

  reset() {
    this.querySelector('form')?.reset();
    this.onReset();
  }
  render() {
    return html`<slot></slot>`;
  }
}
