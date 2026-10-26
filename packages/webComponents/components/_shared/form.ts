import type { ReactiveController, ReactiveControllerHost } from 'lit';

export type FormValue = File | FormData | string | null;

/** 删除 name attribute 后保持字符串语义；空名字不创建提交字段。 */
export const formNameConverter = {
  fromAttribute(value: string | null) {
    return value ?? '';
  },
  toAttribute(value: string) {
    return value || null;
  },
};

type FormControlHost = HTMLElement & ReactiveControllerHost & { disabled?: boolean };
const controllers = new WeakMap<HTMLElement, FormValueController>();
export const getFormController = (host: HTMLElement) => controllers.get(host);

/**
 * Keeps a form-associated custom element's submitted value in sync.
 * Browsers without ElementInternals still retain the component's UI behavior.
 */
export class FormValueController implements ReactiveController {
  private readonly internals: ElementInternals | null;
  private inheritedDisabled = false;
  private customError = '';
  private itemLabels = new WeakMap<HTMLElement, { original: string | null; applied: string }>();

  constructor(
    private readonly host: FormControlHost,
    private readonly getValue: () => FormValue
  ) {
    host.addController(this);
    controllers.set(host, this);

    try {
      this.internals = host.attachInternals();
    } catch {
      this.internals = null;
    }
  }

  hostUpdated() {
    this.sync();
  }

  hostConnected() {
    void this.host.updateComplete.then(() => {
      if (this.host.isConnected) this.sync();
    });
  }

  sync() {
    this.internals?.setFormValue?.(this.disabled ? null : this.getValue());
    this.syncValidity();
  }

  /** Bridge internal native constraints and rule errors into the outer form. */
  private syncValidity() {
    const controls = Array.from(
      this.host.shadowRoot?.querySelectorAll<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >('input:not([type="search"]), select, textarea') ?? []
    );
    const invalid = controls.find((control) => !control.validity.valid && control.willValidate);
    const message = this.disabled ? '' : this.customError || invalid?.validationMessage || '';
    const flags: ValidityStateFlags = {};
    if (message) {
      if (this.customError) flags.customError = true;
      else if (invalid) {
        for (const key of [
          'valueMissing',
          'typeMismatch',
          'patternMismatch',
          'tooLong',
          'tooShort',
          'rangeUnderflow',
          'rangeOverflow',
          'stepMismatch',
          'badInput',
          'customError',
        ] as const)
          if (invalid.validity[key]) flags[key] = true;
      }
    }
    this.internals?.setValidity?.(flags, message, invalid ?? controls[0]);
    const item = this.host.closest?.('su-form-item') as
      | (HTMLElement & { label?: string; message?: string; status?: string })
      | null;
    const description = this.customError || item?.message || '';
    let hint = this.host.shadowRoot?.querySelector<HTMLElement>('#su-form-description');
    if (!hint && this.host.shadowRoot) {
      hint = document.createElement('span');
      hint.id = 'su-form-description';
      // FormItem renders the visible message; this same-root copy supplies its accessible description.
      hint.style.cssText =
        'position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);';
      this.host.shadowRoot.append(hint);
    }
    if (hint) hint.textContent = description;
    controls.forEach((control) => {
      const previous = this.itemLabels.get(control);
      if (item?.label && !control.labels?.length) {
        const current = control.getAttribute('aria-label');
        const original = previous && current === previous.applied ? previous.original : current;
        this.itemLabels.set(control, { original, applied: item.label });
        control.setAttribute('aria-label', item.label);
      } else if (previous) {
        if (control.getAttribute('aria-label') === previous.applied) {
          if (previous.original == null) control.removeAttribute('aria-label');
          else control.setAttribute('aria-label', previous.original);
        }
        this.itemLabels.delete(control);
      }
      const ids = (control.getAttribute('aria-describedby') ?? '')
        .split(' ')
        .filter((id) => id && id !== 'su-form-description');
      if (description) ids.push('su-form-description');
      if (ids.length) control.setAttribute('aria-describedby', ids.join(' '));
      else control.removeAttribute('aria-describedby');
      if (message || item?.status === 'error') control.setAttribute('aria-invalid', 'true');
      else if (!('error' in this.host) || !(this.host as unknown as { error: boolean }).error)
        control.setAttribute('aria-invalid', 'false');
    });
  }

  setCustomValidity(message: string) {
    this.customError = message;
    this.syncValidity();
  }

  get validationMessage() {
    if (this.disabled) return '';
    return (
      this.customError ||
      Array.from(
        this.host.shadowRoot?.querySelectorAll<HTMLInputElement>('input, select, textarea') ?? []
      ).find((control) => control.willValidate && !control.validity.valid)?.validationMessage ||
      ''
    );
  }

  /** Same value source as native FormData submission, also used by rule validation. */
  get value() {
    return this.disabled ? null : this.getValue();
  }

  checkValidity() {
    this.sync();
    return !this.validationMessage;
  }

  /** 有效禁用状态包含自身 disabled 与原生 fieldset 继承状态。 */
  get disabled() {
    return Boolean(this.host.disabled) || this.inheritedDisabled;
  }

  /** 保留业务设置的 disabled，只更新浏览器通知的有效状态。 */
  setDisabled(disabled: boolean) {
    this.inheritedDisabled = disabled;
    this.host.requestUpdate();
    this.sync();
  }

  get form() {
    return this.internals?.form ?? null;
  }
}
