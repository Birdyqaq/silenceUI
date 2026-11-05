import { LitElement, css, html, nothing, type PropertyValues } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { live } from 'lit/directives/live.js';
import { repeat } from 'lit/directives/repeat.js';
import { positionFloating, trackFloating } from '../../_shared/floating';
import { formNameConverter, FormValueController } from '../../_shared/form';
import { baseControlStyles, focusRingStyles } from '../../_shared/styles';

export interface AutoCompleteOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface AutoCompleteQueryDetail {
  query: string;
}

export interface AutoCompleteChangeDetail {
  value: string;
  option: AutoCompleteOption | null;
}

@customElement('su-auto-complete')
export class SuAutoComplete extends LitElement {
  static formAssociated = true;

  @property() value = '';
  @property() label = '搜索';
  @property({ type: String, reflect: true, converter: formNameConverter }) name = '';
  @property({ attribute: false }) options: AutoCompleteOption[] = [];
  @property({ type: Boolean }) remote = false;
  @property({ type: Boolean, attribute: 'selection-only' }) selectionOnly = false;
  @state() private searchText: string | undefined;
  private selectedOption?: AutoCompleteOption;
  @property({ type: Boolean }) loading = false;
  @property() errorMessage = '';
  @property({ type: Boolean }) required = false;
  @property({ type: Boolean, reflect: true }) disabled = false;
  @state() private open = false;
  @state() private active: AutoCompleteOption | undefined;
  @state() private draft = '';
  private composing = false;
  private stopTracking?: () => void;
  private initial = '';
  private readonly formValue = new FormValueController(this, () => this.value);

  static styles = [
    baseControlStyles,
    focusRingStyles,
    css`
      :host {
        display: block;
        position: relative;
        min-width: 0;
      }
      .field {
        display: flex;
        gap: 4px;
      }
      input {
        flex: 1;
        min-width: 0;
        font: inherit;
        color: var(--su-text-1);
        background: var(--su-bg-card);
        border: 1px solid var(--su-border-color);
        border-radius: var(--su-radius-sm);
        padding: 6px 8px;
      }
      .popup {
        position: absolute;
        z-index: 1;
        inset-inline: 0;
        margin: 0;
        padding: 0;
        max-height: min(240px, var(--su-floating-max-height, calc(100vh - 16px)));
        overflow: auto;
        background: var(--su-bg-card);
        color: var(--su-text-1);
        border: 1px solid var(--su-border-color);
        overflow-wrap: anywhere;
      }
      .popup:popover-open {
        position: fixed;
        inset: auto;
        width: min(var(--su-anchor-width, 100%), var(--su-floating-max-width, calc(100vw - 16px)));
      }
      .popup[hidden] {
        display: none;
      }
      [role='option'],
      [role='status'][data-message] {
        padding: 6px 8px;
      }
      [role='option'][aria-selected='true'] {
        outline: 1px solid var(--su-color-primary);
        outline-offset: -1px;
      }
      [aria-disabled='true'] {
        opacity: 0.6;
      }
    `,
  ];

  private get input() {
    return this.shadowRoot?.querySelector('input');
  }

  private get displayValue() {
    if (!this.selectionOnly) return this.value;
    return (
      this.searchText ??
      (this.selectedOption?.value === this.value ? this.selectedOption.label : undefined) ??
      this.options.find((option) => option.value === this.value)?.label ??
      this.value
    );
  }

  private get candidates() {
    if (this.loading || this.errorMessage) return [];
    const query = (this.selectionOnly ? (this.searchText ?? '') : this.value).toLowerCase();
    return this.remote
      ? this.options
      : this.options.filter(
          (option) =>
            option.label.toLowerCase().includes(query) || option.value.toLowerCase().includes(query)
        );
  }

  private get expanded() {
    return this.open && !this.formValue.disabled && !this.composing;
  }

  firstUpdated() {
    this.initial = this.value;
  }

  protected willUpdate(changed: PropertyValues) {
    if (
      this.formValue.disabled ||
      changed.has('selectionOnly') ||
      (this.selectionOnly && changed.has('value'))
    )
      this.close();
    if (['value', 'options', 'remote', 'loading', 'errorMessage'].some((key) => changed.has(key)))
      this.active = undefined;
  }

  protected updated() {
    this.input?.setCustomValidity(
      this.selectionOnly && !this.value && (this.required || Boolean(this.searchText))
        ? '请选择候选项'
        : ''
    );
    this.formValue.sync();
    const field = this.renderRoot.querySelector<HTMLElement>('.field');
    const popup = this.renderRoot.querySelector<HTMLElement>('.popup');
    if (!this.isConnected || !this.expanded || !field || !popup?.showPopover) {
      if (popup?.hidePopover && popup.matches(':popover-open')) popup.hidePopover();
      this.stopPositioning();
      return;
    }
    if (!popup.matches(':popover-open')) popup.showPopover();
    const update = () => {
      popup.style.setProperty('--su-anchor-width', `${field.getBoundingClientRect().width}px`);
      positionFloating(field, popup, 'bottom', true);
    };
    update();
    this.stopTracking ??= trackFloating(field, popup, update);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.stopPositioning();
    this.close();
  }

  private stopPositioning() {
    this.stopTracking?.();
    this.stopTracking = undefined;
  }

  private close() {
    this.open = false;
    this.searchText = undefined;
    this.active = undefined;
    this.composing = false;
  }

  formDisabledCallback(disabled: boolean) {
    this.formValue.setDisabled(disabled);
    if (disabled) this.close();
  }

  formResetCallback() {
    this.close();
    this.value = this.initial;
    if (this.input) this.input.value = this.value;
    this.formValue.sync();
  }

  formStateRestoreCallback(state: string | File | FormData | null) {
    if (typeof state === 'string') {
      this.close();
      this.value = state;
    }
  }

  focus(options?: FocusOptions) {
    this.input?.focus(options);
  }

  private emitChange(detail: AutoCompleteChangeDetail) {
    this.dispatchEvent(new CustomEvent('change', { detail, bubbles: true, composed: true }));
  }

  private edit(value: string) {
    this.open = true;
    if (this.selectionOnly) {
      if (value === this.searchText) return;
      this.searchText = value;
      this.active = undefined;
      this.emitQuery(value);
      return;
    }
    if (value === this.value) return;
    this.value = value;
    this.active = undefined;
    this.formValue.sync();
    this.emitChange({ value, option: null });
    if (this.isConnected && this.expanded && this.value === value) this.emitQuery(value);
  }

  private emitQuery(query: string) {
    this.dispatchEvent(
      new CustomEvent<AutoCompleteQueryDetail>('query', {
        detail: { query },
        bubbles: true,
        composed: true,
      })
    );
  }

  private onInput(event: InputEvent) {
    event.stopPropagation();
    if (event.target !== this.input || this.formValue.disabled || !this.isConnected) return;
    const value = this.input!.value;
    if (this.composing || event.isComposing) this.draft = value;
    else this.edit(value);
  }

  private startComposition(event: CompositionEvent) {
    if (event.target !== this.input || this.formValue.disabled || !this.isConnected) return;
    this.draft = this.input!.value;
    this.composing = true;
    this.requestUpdate();
  }

  private endComposition(event: CompositionEvent) {
    if (
      !this.composing ||
      event.target !== this.input ||
      this.formValue.disabled ||
      !this.isConnected
    )
      return;
    this.composing = false;
    this.requestUpdate();
    this.edit(this.input!.value);
  }

  private choose(option: AutoCompleteOption, event?: Event) {
    if (
      !this.isConnected ||
      !this.expanded ||
      option.disabled ||
      !this.candidates.includes(option) ||
      (event && !this.renderRoot.contains(event.currentTarget as Node))
    )
      return;
    this.selectedOption = option;
    this.value = option.value;
    this.close();
    if (this.input) this.input.value = this.displayValue;
    this.formValue.sync();
    this.emitChange({ value: this.value, option });
  }

  private navigate(event: KeyboardEvent) {
    if (this.formValue.disabled || this.composing || event.isComposing || !this.isConnected) return;
    const options = this.candidates;
    if (event.key === 'Escape' && this.expanded) {
      event.preventDefault();
      event.stopPropagation();
      this.close();
    } else if (event.key === 'Enter' && this.expanded && this.active) {
      event.preventDefault();
      this.choose(this.active);
    } else if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      this.open = true;
      const enabled = options.flatMap((option, index) => (option.disabled ? [] : [index]));
      const current = enabled.indexOf(this.active ? options.indexOf(this.active) : -1);
      const offset = event.key === 'ArrowDown' ? 1 : -1;
      const next = current < 0 && offset < 0 ? enabled.length - 1 : current + offset;
      const index = enabled[(next + enabled.length) % enabled.length];
      this.active = options[index];
      const active = this.active;
      void this.updateComplete.then(() => {
        if (!this.isConnected || !this.expanded || !active || this.active !== active) return;
        const option = this.shadowRoot?.getElementById(`option-${index}`);
        const popup = this.renderRoot.querySelector<HTMLElement>('.popup');
        if (!option || !popup) return;
        const item = option.getBoundingClientRect();
        const viewport = popup.getBoundingClientRect();
        if (item.bottom > viewport.bottom) popup.scrollTop += item.bottom - viewport.bottom;
        else if (item.top < viewport.top) popup.scrollTop -= viewport.top - item.top;
      });
    }
  }

  private clear() {
    if (!this.isConnected || this.formValue.disabled || !this.input) return;
    this.composing = false;
    this.input.focus();
    this.input.value = '';
    if (this.selectionOnly && this.value) {
      this.value = '';
      this.selectedOption = undefined;
      this.formValue.sync();
      this.emitChange({ value: '', option: null });
    }
    this.edit('');
  }

  render() {
    const candidates = this.candidates;
    const expanded = this.expanded;
    const activeIndex = this.active ? candidates.indexOf(this.active) : -1;
    const message = this.loading
      ? '加载中'
      : this.errorMessage || (candidates.length ? '' : '无匹配项');
    return html`<div class="field">
        <input
          part="control"
          role="combobox"
          aria-label=${this.label}
          aria-autocomplete="list"
          aria-expanded=${expanded}
          aria-controls="suggestions"
          aria-activedescendant=${expanded && activeIndex >= 0 ? `option-${activeIndex}` : nothing}
          .value=${live(this.composing ? this.draft : this.displayValue)}
          ?disabled=${this.formValue.disabled}
          ?required=${this.required && (!this.selectionOnly || !this.value)}
          @input=${this.onInput}
          @change=${(event: Event) => event.stopPropagation()}
          @compositionstart=${this.startComposition}
          @compositionend=${this.endComposition}
          @keydown=${this.navigate}
          @blur=${this.close}
          @click=${() => {
            this.open = true;
          }}
        />
        <button
          type="button"
          part="clear-button"
          ?disabled=${this.formValue.disabled || !this.value}
          @click=${this.clear}
        >
          清空
        </button>
      </div>
      <div class="popup" part="popup" popover="manual" ?hidden=${!expanded}>
        <div id="suggestions" role="listbox" aria-label=${this.label} aria-busy=${this.loading}>
          ${repeat(
            expanded ? candidates : [],
            (option) => option,
            (option, index) =>
              html` <div
                id=${`option-${index}`}
                role="option"
                part="option"
                aria-selected=${index === activeIndex}
                aria-disabled=${Boolean(option.disabled)}
                @mousedown=${(event: MouseEvent) => event.preventDefault()}
                @click=${(event: Event) => this.choose(option, event)}
              >
                ${option.label}
              </div>`
          )}
        </div>
        <div role="status" ?data-message=${Boolean(message)}>${message}</div>
      </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'su-auto-complete': SuAutoComplete;
  }
}
