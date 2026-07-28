import type { ReactiveController, ReactiveControllerHost } from 'lit';

export type FormValue = File | FormData | string | null;

type FormControlHost = HTMLElement & ReactiveControllerHost;

/**
 * Keeps a form-associated custom element's submitted value in sync.
 * Browsers without ElementInternals still retain the component's UI behavior.
 */
export class FormValueController implements ReactiveController {
  private readonly internals: ElementInternals | null;

  constructor(private readonly host: FormControlHost, private readonly getValue: () => FormValue) {
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
    this.internals?.setFormValue?.(this.getValue());
  }

  get form() {
    return this.internals?.form ?? null;
  }
}
