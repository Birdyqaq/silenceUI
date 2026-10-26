import { LitElement, css, html, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { formNameConverter, FormValueController } from '../../_shared/form';
import { baseControlStyles, focusRingStyles } from '../../_shared/styles';
import { parseJsonArray } from '../../_shared/utils';

interface SelectOption {
  label: string;
  value: string | number;
  disabled?: boolean;
}

@customElement('su-select')
export class SuSelect extends LitElement {
  static formAssociated = true;

  @property({ type: Array, attribute: false }) options: SelectOption[] = [];
  @property({ type: String }) optionsJson = '';
  @property({ type: String }) value = '';
  @property({ type: String, reflect: true, converter: formNameConverter }) name = '';
  @property({ type: String }) placeholder = '请选择';
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ type: Boolean }) multiple = false;
  @property({ type: Array, attribute: false }) values: string[] = [];
  @property({ type: Boolean }) searchable = false;
  @property({ type: Boolean }) clearable = false;
  @property({ type: Boolean }) remote = false;
  @property({ type: Boolean }) loading = false;
  @property({ type: Boolean }) required = false;
  @property({ type: String }) label = '';
  @state() private query = '';

  private defaultValue = '';
  private defaultValues: string[] = [];
  private selectedOptions = new Map<string, SelectOption>();
  private readonly formValue: FormValueController = new FormValueController(this, () => {
    if (this.formValue.disabled) return null;
    if (!this.multiple)
      return this.mergedOptions.find((option) => String(option.value) === this.value)?.disabled
        ? null
        : this.value;
    const data = new FormData();
    if (this.name)
      this.values.forEach((value) => {
        if (!this.mergedOptions.find((option) => String(option.value) === value)?.disabled)
          data.append(this.name, value);
      });
    return data;
  });

  static styles = [
    baseControlStyles,
    focusRingStyles,
    css`
      :host {
        display: block;
      }

      .select {
        width: 100%;
        border: 1px solid var(--su-border-color);
        border-radius: var(--su-radius-sm);
        padding: 8px 10px;
        font-size: var(--su-font-size-md);
        color: var(--su-text-1);
        background: var(--su-bg-card);
      }

      .select:hover {
        border-color: var(--su-border-color-hover);
      }

      .select:disabled {
        color: var(--su-text-3);
        cursor: not-allowed;
        background: var(--su-bg-muted);
      }
      .field {
        display: grid;
        gap: 6px;
      }
      input,
      button {
        font: inherit;
        color: var(--su-text-1);
        background: var(--su-bg-card);
        border: 1px solid var(--su-border-color);
        border-radius: var(--su-radius-sm);
        padding: 6px;
      }
      label {
        color: var(--su-text-2);
        font-size: var(--su-font-size-sm);
      }
    `,
  ];

  private get sourceOptions(): SelectOption[] {
    const source =
      Array.isArray(this.options) && this.options.length
        ? this.options
        : parseJsonArray<unknown>(this.optionsJson, []);
    const seen = new Set<string>();
    return source.filter((option): option is SelectOption => {
      if (
        !option ||
        typeof option !== 'object' ||
        !('label' in option) ||
        typeof option.label !== 'string' ||
        !('value' in option) ||
        (typeof option.value !== 'string' &&
          (typeof option.value !== 'number' || !Number.isFinite(option.value)))
      )
        return false;
      const key = String(option.value);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  private get mergedOptions(): SelectOption[] {
    const options = this.sourceOptions;
    const keys = new Set(options.map((option) => String(option.value)));
    return [
      ...options,
      ...Array.from(this.selectedOptions.values()).filter(
        (option) => !keys.has(String(option.value))
      ),
    ];
  }

  /** Retain only selected labels when a remote response replaces the current option page. */
  protected willUpdate() {
    const options = this.sourceOptions;
    const selected = this.multiple ? this.values : this.value ? [this.value] : [];
    this.selectedOptions = new Map(
      selected.map((value) => [
        value,
        options.find((option) => String(option.value) === value) ??
          this.selectedOptions.get(value) ?? { value, label: value },
      ])
    );
  }

  private handleChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    if (this.formValue.disabled || this.loading) return;
    this.value = target.value;
    if (this.multiple) this.values = Array.from(target.selectedOptions, (option) => option.value);
    this.emitChange();
  }

  private handleSearch(event: Event) {
    // Search edits options, not the field value; do not invalidate form rules for a selection that is unchanged.
    event.stopPropagation();
    if (this.formValue.disabled) return;
    this.query = (event.target as HTMLInputElement).value;
    this.dispatchEvent(
      new CustomEvent('search', { detail: { query: this.query }, bubbles: true, composed: true })
    );
  }

  private emitChange() {
    this.dispatchEvent(
      new CustomEvent('change', {
        detail: { value: this.multiple ? [...this.values] : this.value },
        bubbles: true,
        composed: true,
      })
    );
  }

  firstUpdated() {
    this.defaultValue = this.value;
    this.defaultValues = [...this.values];
  }

  /** 原生 fieldset 禁用变化同步到内部控件，保留自身 disabled。 */
  formDisabledCallback(disabled: boolean) {
    this.formValue.setDisabled(disabled);
  }

  formResetCallback() {
    this.value = this.defaultValue;
    this.values = [...this.defaultValues];
    this.query = '';
  }

  formStateRestoreCallback(state: string | File | FormData | null) {
    if (typeof state === 'string') this.value = state;
    if (state instanceof FormData)
      this.values = state
        .getAll(this.name)
        .filter((value): value is string => typeof value === 'string');
  }

  focus(options?: FocusOptions) {
    this.shadowRoot?.querySelector('select')?.focus(options);
  }

  protected updated() {
    const select = this.shadowRoot?.querySelector('select');
    if (select) {
      if (this.multiple)
        Array.from(select.options).forEach((option) => {
          option.selected = this.values.includes(option.value);
        });
      else if (select.value !== this.value) select.value = this.value;
      this.formValue.sync();
    }
  }

  render() {
    return html`
      <div class="field">
        ${this.label ? html`<label for="select">${this.label}</label>` : nothing}
        ${this.searchable
          ? html`<input
              type="search"
              aria-label=${`搜索${this.label || '选项'}`}
              .value=${this.query}
              ?disabled=${this.formValue.disabled}
              @input=${this.handleSearch}
              @change=${(event: Event) => event.stopPropagation()}
            />`
          : nothing}
        <select
          id="select"
          class="select"
          aria-label=${this.label || this.placeholder}
          aria-busy=${String(this.loading)}
          ?multiple=${this.multiple}
          ?required=${this.required}
          ?disabled=${this.formValue.disabled || this.loading}
          @change=${this.handleChange}
        >
          ${!this.multiple ? html`<option value="">${this.placeholder}</option>` : nothing}
          ${this.mergedOptions
            .filter(
              (option) =>
                this.remote ||
                !this.query ||
                option.label.toLocaleLowerCase().includes(this.query.toLocaleLowerCase()) ||
                (this.multiple
                  ? this.values.includes(String(option.value))
                  : this.value === String(option.value))
            )
            .map(
              (option) =>
                html`<option value=${String(option.value)} ?disabled=${Boolean(option.disabled)}>
                  ${option.label}
                </option>`
            )}
        </select>
        ${this.loading ? html`<span role="status">加载中…</span>` : nothing}
        ${this.clearable
          ? html`<button
              type="button"
              ?disabled=${this.formValue.disabled || this.loading}
              @click=${() => {
                if (this.formValue.disabled || this.loading) return;
                this.value = '';
                this.values = [];
                this.emitChange();
              }}
            >
              清空
            </button>`
          : nothing}
      </div>
    `;
  }
}

export type { SelectOption };
