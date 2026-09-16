import { LitElement, css, html, nothing, type PropertyValues } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { FormValueController } from '../../_shared/form';
import { baseControlStyles, focusRingStyles } from '../../_shared/styles';
import { parseJsonArray } from '../../_shared/utils';

interface CascaderOption {
  value: string;
  label: string;
  disabled?: boolean;
  children?: CascaderOption[];
}

let cascaderInstanceId = 0;

@customElement('su-cascader')
export class SuCascader extends LitElement {
  static formAssociated = true;

  @property({ type: Array, attribute: false }) options: CascaderOption[] = [];
  @property({ type: String }) optionsJson = '';
  @property({ type: Array, attribute: false }) value: string[] = [];
  @property({ type: String }) valueJson = '';
  @property({ type: String }) name = '';
  @property({ type: String }) placeholder = '请选择';
  @property({ type: String }) separator = ' / ';
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ type: Boolean, reflect: true }) open = false;

  @state() private activePath: string[] = [];

  private readonly panelId = `su-cascader-${++cascaderInstanceId}`;
  private defaultValue: string[] = [];
  private readonly formValue = new FormValueController(this, () =>
    this.disabled || this.currentValue.length === 0 ? null : JSON.stringify(this.currentValue)
  );

  static styles = [
    baseControlStyles,
    focusRingStyles,
    css`
      :host {
        display: block;
        position: relative;
      }

      .trigger {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 8px;
        width: 100%;
        border: 1px solid var(--su-border-color);
        border-radius: var(--su-radius-sm);
        background: var(--su-bg-card);
        color: var(--su-text-1);
        padding: 8px 10px;
        font-size: var(--su-font-size-md);
        text-align: left;
        cursor: pointer;
      }

      .trigger:hover:not(:disabled) {
        border-color: var(--su-border-color-hover);
      }

      .trigger:disabled {
        background: var(--su-bg-muted);
        color: var(--su-text-3);
        cursor: not-allowed;
      }

      .placeholder {
        color: var(--su-text-3);
      }

      .popup {
        position: absolute;
        z-index: 1100;
        top: calc(100% + 6px);
        left: 0;
        display: flex;
        max-width: min(720px, calc(100vw - 32px));
        border: 1px solid var(--su-border-color);
        border-radius: var(--su-radius-md);
        background: var(--su-bg-card);
        box-shadow: var(--su-shadow-md);
        overflow: hidden;
      }

      .panel {
        min-width: 160px;
        max-height: 260px;
        overflow: auto;
        padding: 4px;
      }

      .panel + .panel {
        border-left: 1px solid var(--su-border-color);
      }

      .option {
        display: flex;
        justify-content: space-between;
        gap: 12px;
        width: 100%;
        border: none;
        border-radius: var(--su-radius-sm);
        background: transparent;
        color: var(--su-text-2);
        padding: 8px 10px;
        text-align: left;
        cursor: pointer;
      }

      .option:hover:not(:disabled),
      .option.active {
        background: var(--su-bg-hover);
        color: var(--su-color-primary);
      }

      .option.selected {
        font-weight: 600;
      }

      .option:disabled {
        color: var(--su-text-3);
        cursor: not-allowed;
        opacity: 0.6;
      }
    `,
  ];

  private onDocumentClick = (event: MouseEvent) => {
    if (!this.open || event.composedPath().includes(this)) return;
    this.open = false;
  };

  private onWindowKeydown = (event: KeyboardEvent) => {
    if (!this.open || event.key !== 'Escape') return;
    event.preventDefault();
    this.open = false;
    void this.updateComplete.then(() => this.focus());
  };

  connectedCallback() {
    super.connectedCallback();
    document.addEventListener('click', this.onDocumentClick);
    window.addEventListener('keydown', this.onWindowKeydown);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener('click', this.onDocumentClick);
    window.removeEventListener('keydown', this.onWindowKeydown);
  }

  private get mergedOptions() {
    if (this.options.length > 0) return this.options;
    return parseJsonArray<CascaderOption>(this.optionsJson, []);
  }

  private get currentValue() {
    return this.value;
  }

  private findOption(options: CascaderOption[], value: string) {
    return options.find((option) => option.value === value);
  }

  private get pathOptions() {
    const path: CascaderOption[] = [];
    let options = this.mergedOptions;
    for (const value of this.currentValue) {
      const option = this.findOption(options, value);
      if (!option) break;
      path.push(option);
      options = option.children ?? [];
    }
    return path;
  }

  private get panels() {
    const panels: CascaderOption[][] = [this.mergedOptions];
    let options = this.mergedOptions;
    for (const value of this.activePath) {
      const option = this.findOption(options, value);
      if (!option?.children?.length) break;
      options = option.children;
      panels.push(options);
    }
    return panels;
  }

  private toggleOpen() {
    if (this.disabled) return;
    this.open = !this.open;
    if (this.open) this.activePath = [...this.currentValue];
  }

  private selectOption(option: CascaderOption, level: number) {
    if (option.disabled) return;
    const path = [...this.activePath.slice(0, level), option.value];
    this.activePath = path;
    if (option.children?.length) return;

    this.value = path;
    this.valueJson = '';
    this.open = false;
    this.dispatchEvent(
      new CustomEvent('change', {
        detail: { value: [...path], option },
        bubbles: true,
        composed: true,
      })
    );
    void this.updateComplete.then(() => this.focus());
  }

  private focusOption(level: number, index: number) {
    void this.updateComplete.then(() => {
      const panel = this.shadowRoot?.querySelectorAll<HTMLElement>('.panel')[level];
      panel?.querySelectorAll<HTMLButtonElement>('.option:not(:disabled)')[index]?.focus();
    });
  }

  private onOptionKeyDown(
    event: KeyboardEvent,
    option: CascaderOption,
    level: number,
    enabledIndex: number
  ) {
    const enabled = this.panels[level].filter((item) => !item.disabled);
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      const offset = event.key === 'ArrowDown' ? 1 : -1;
      this.focusOption(level, (enabledIndex + offset + enabled.length) % enabled.length);
    } else if (event.key === 'Home' || event.key === 'End') {
      event.preventDefault();
      this.focusOption(level, event.key === 'Home' ? 0 : enabled.length - 1);
    } else if (event.key === 'ArrowRight' && option.children?.length) {
      event.preventDefault();
      this.selectOption(option, level);
      this.focusOption(level + 1, 0);
    } else if (event.key === 'ArrowLeft' && level > 0) {
      event.preventDefault();
      const parentValue = this.activePath[level - 1];
      this.activePath = this.activePath.slice(0, level);
      void this.updateComplete.then(() => {
        const parentPanel = this.shadowRoot?.querySelectorAll<HTMLElement>('.panel')[level - 1];
        Array.from(parentPanel?.querySelectorAll<HTMLButtonElement>('.option') ?? [])
          .find((button) => button.dataset.value === parentValue)
          ?.focus();
      });
    } else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.selectOption(option, level);
      if (option.children?.length) this.focusOption(level + 1, 0);
    }
  }

  protected firstUpdated() {
    this.defaultValue = [...this.currentValue];
  }

  protected willUpdate(changedProperties: PropertyValues<this>) {
    if (changedProperties.has('valueJson') && this.value.length === 0 && this.valueJson) {
      this.value = parseJsonArray<string>(this.valueJson, []);
    }
    if (changedProperties.has('open') && this.open) {
      this.activePath = [...this.currentValue];
    }
  }

  protected updated(changedProperties: PropertyValues<this>) {
    if (changedProperties.has('open') && this.open) {
      this.focusOption(0, 0);
    }
  }

  formResetCallback() {
    this.value = [...this.defaultValue];
    this.valueJson = '';
  }

  formStateRestoreCallback(state: string | File | FormData | null) {
    if (typeof state !== 'string') return;
    this.value = parseJsonArray<string>(state, []);
    this.valueJson = '';
  }

  focus(options?: FocusOptions) {
    this.shadowRoot?.querySelector<HTMLButtonElement>('.trigger')?.focus(options);
  }

  render() {
    const pathOptions = this.pathOptions;
    const display = pathOptions.map((option) => option.label).join(this.separator);
    return html`
      <button
        class="trigger"
        type="button"
        ?disabled=${this.disabled}
        aria-haspopup="listbox"
        aria-expanded=${String(this.open)}
        aria-controls=${this.panelId}
        @click=${this.toggleOpen}
      >
        <span class=${display ? '' : 'placeholder'}>${display || this.placeholder}</span>
        <span aria-hidden="true">${this.open ? '▴' : '▾'}</span>
      </button>
      ${this.open
        ? html`
            <div id=${this.panelId} class="popup" role="group" aria-label="级联选项">
              ${this.panels.map((options, level) => {
                let enabledIndex = -1;
                return html`
                  <div class="panel" role="listbox" aria-label=${`第 ${level + 1} 级`}>
                    ${options.map((option) => {
                      if (!option.disabled) enabledIndex += 1;
                      const optionEnabledIndex = enabledIndex;
                      const active = this.activePath[level] === option.value;
                      const selected = this.currentValue[level] === option.value;
                      return html`
                        <button
                          class="option ${active ? 'active' : ''} ${selected ? 'selected' : ''}"
                          data-value=${option.value}
                          type="button"
                          role="option"
                          aria-selected=${selected ? 'true' : 'false'}
                          ?disabled=${Boolean(option.disabled)}
                          @click=${() => this.selectOption(option, level)}
                          @keydown=${(event: KeyboardEvent) =>
                            this.onOptionKeyDown(event, option, level, optionEnabledIndex)}
                        >
                          <span>${option.label}</span>
                          ${option.children?.length
                            ? html`<span aria-hidden="true">›</span>`
                            : nothing}
                        </button>
                      `;
                    })}
                  </div>
                `;
              })}
            </div>
          `
        : nothing}
    `;
  }
}

export type { CascaderOption };
