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

/**
 * Keeps a form-associated custom element's submitted value in sync.
 * Browsers without ElementInternals still retain the component's UI behavior.
 */
export class FormValueController implements ReactiveController {
  private readonly internals: ElementInternals | null;
  private inheritedDisabled = false;

  constructor(
    private readonly host: FormControlHost,
    private readonly getValue: () => FormValue
  ) {
    host.addController(this);

    try {
      this.internals = host.attachInternals();
    } catch {
      this.internals = null;
    }
  }

  hostUpdated() {
    this.sync();
  }

  sync() {
    this.internals?.setFormValue?.(this.disabled ? null : this.getValue());
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
