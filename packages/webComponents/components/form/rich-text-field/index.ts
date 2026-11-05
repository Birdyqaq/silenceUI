import { LitElement, html, type PropertyValues } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { FormValueController, formNameConverter } from '../../_shared/form';

/** Adapter methods are synchronous. Programmatic writes must not emit a user edit. */
export interface RichTextEditorAdapter {
  setValue(value: string): void;
  setDisabled(disabled: boolean): void;
  subscribe(onChange: (value: string) => void): () => void;
  focus(options?: FocusOptions): void;
}

@customElement('su-rich-text-field')
export class SuRichTextField extends LitElement {
  static formAssociated = true;
  @property({ type: String, reflect: true, converter: formNameConverter }) name = '';
  @property({ type: String, attribute: false }) value = '';
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ attribute: false }) adapter?: RichTextEditorAdapter;

  private initialValue = '';
  private connectedAdapter?: RichTextEditorAdapter;
  private subscription?: symbol;
  private unsubscribe?: () => void;
  private editorValue?: string;
  private readonly formValue = new FormValueController(this, () => this.value);

  connectedCallback() {
    super.connectedCallback();
    this.requestUpdate();
  }

  disconnectedCallback() {
    this.detachAdapter();
    super.disconnectedCallback();
  }

  private detachAdapter() {
    this.connectedAdapter = undefined;
    this.subscription = undefined;
    this.editorValue = undefined;
    const unsubscribe = this.unsubscribe;
    this.unsubscribe = undefined;
    unsubscribe?.();
  }

  protected firstUpdated() {
    this.initialValue = this.value;
  }

  protected updated(changed: PropertyValues) {
    const adapter = this.adapter;
    if (!this.isConnected) return;
    if (this.connectedAdapter !== adapter) {
      this.detachAdapter();
      if (!adapter) return;
      this.connectedAdapter = adapter;
      adapter.setDisabled(this.formValue.disabled);
      adapter.setValue(this.value);
      this.editorValue = this.value;
      const subscription = Symbol();
      this.subscription = subscription;
      const unsubscribe = adapter.subscribe((value) => {
        if (
          this.subscription !== subscription ||
          this.adapter !== adapter ||
          this.formValue.disabled ||
          value === this.value
        )
          return;
        this.editorValue = value;
        this.value = value;
        this.formValue.sync();
        this.dispatchEvent(
          new CustomEvent('change', {
            detail: { value },
            bubbles: true,
            composed: true,
          })
        );
      });
      if (this.subscription === subscription) this.unsubscribe = unsubscribe;
      else unsubscribe();
      return;
    }
    if (changed.has('disabled')) adapter?.setDisabled(this.formValue.disabled);
    if (adapter && this.editorValue !== this.value) {
      this.editorValue = this.value;
      adapter.setValue(this.value);
    }
  }

  formDisabledCallback(disabled: boolean) {
    this.formValue.setDisabled(disabled);
    this.connectedAdapter?.setDisabled(this.formValue.disabled);
  }

  formResetCallback() {
    this.value = this.initialValue;
  }

  formStateRestoreCallback(state: string | File | FormData | null) {
    if (typeof state === 'string') this.value = state;
  }

  focus(options?: FocusOptions) {
    this.connectedAdapter?.focus(options);
  }

  render() {
    return html`<slot></slot>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'su-rich-text-field': SuRichTextField;
  }
}
