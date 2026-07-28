import { LitElement, css, html, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { baseControlStyles, focusRingStyles } from '../../_shared/styles';
import { parseJsonArray } from '../../_shared/utils';

interface DropdownItem {
  key: string;
  label: string;
  disabled?: boolean;
  danger?: boolean;
}

let dropdownInstanceId = 0;

@customElement('su-dropdown')
export class SuDropdown extends LitElement {
  @property({ type: Array, attribute: false }) items: DropdownItem[] = [];
  @property({ type: String }) itemsJson = '';
  @property({ type: Boolean, reflect: true }) open = false;
  @property({ type: Boolean, reflect: true }) disabled = false;

  @state() private triggerNeedsTabStop = true;

  private readonly menuId = `su-dropdown-${++dropdownInstanceId}-menu`;
  private triggerElement: HTMLElement | null = null;

  static styles = [
    baseControlStyles,
    focusRingStyles,
    css`
      :host {
        display: inline-block;
        position: relative;
      }

      .trigger {
        cursor: pointer;
      }

      :host([disabled]) .trigger {
        cursor: not-allowed;
        opacity: 0.6;
      }

      .menu {
        position: absolute;
        top: calc(100% + 6px);
        left: 0;
        z-index: 1050;
        min-width: 140px;
        background: var(--su-bg-card);
        border: 1px solid var(--su-border-color);
        border-radius: var(--su-radius-sm);
        box-shadow: var(--su-shadow-md);
        padding: 4px;
        display: grid;
      }

      .item {
        border: none;
        background: transparent;
        cursor: pointer;
        text-align: left;
        padding: 8px 10px;
        border-radius: 4px;
        font-size: var(--su-font-size-sm);
        color: var(--su-text-2);
      }

      .item:hover:not(:disabled) {
        background: var(--su-bg-hover);
        color: var(--su-text-1);
      }

      .item.danger {
        color: var(--su-color-error);
      }

      .item.danger:hover:not(:disabled) {
        background: rgba(var(--su-color-error-rgb), 0.08);
        color: var(--su-color-error);
      }

      .item:disabled {
        color: var(--su-text-3);
        cursor: not-allowed;
        opacity: 0.6;
      }
    `,
  ];

  private onDocumentClick = (event: MouseEvent) => {
    if (!this.open) return;
    if (event.composedPath().includes(this)) return;
    this.open = false;
  };

  connectedCallback() {
    super.connectedCallback();
    document.addEventListener('click', this.onDocumentClick);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener('click', this.onDocumentClick);
  }

  private get mergedItems() {
    if (this.items.length > 0) return this.items;
    return parseJsonArray<DropdownItem>(this.itemsJson, []);
  }

  private updateTriggerAria() {
    const target =
      this.triggerElement?.shadowRoot?.querySelector<HTMLElement>(
        'button, a[href], input, select, textarea, [tabindex]'
      ) ?? this.triggerElement;

    target?.setAttribute('aria-haspopup', 'menu');
    target?.setAttribute('aria-expanded', String(this.open));
    target?.setAttribute('aria-controls', this.menuId);
  }

  private onSlotChange(event: Event) {
    const slot = event.target as HTMLSlotElement;
    const assigned = slot.assignedElements({ flatten: true })[0];
    this.triggerElement = assigned instanceof HTMLElement ? assigned : null;

    const focusable =
      this.triggerElement?.matches('button, a[href], input, select, textarea, [tabindex]') ||
      Boolean(
        this.triggerElement?.shadowRoot?.querySelector(
          'button, a[href], input, select, textarea, [tabindex]'
        )
      );
    this.triggerNeedsTabStop = !focusable;
    this.updateTriggerAria();
  }

  private async openMenu() {
    if (this.disabled || this.open) return;
    this.open = true;
    await this.updateComplete;
    this.shadowRoot?.querySelector<HTMLButtonElement>('.item:not(:disabled)')?.focus();
  }

  private toggle() {
    if (this.disabled) return;
    if (this.open) {
      this.open = false;
    } else {
      void this.openMenu();
    }
  }

  private focusTrigger() {
    const target =
      this.triggerElement?.shadowRoot?.querySelector<HTMLElement>(
        'button, a[href], input, select, textarea, [tabindex]'
      ) ??
      this.triggerElement ??
      this.shadowRoot?.querySelector<HTMLElement>('.trigger');
    target?.focus();
  }

  private onTriggerKeyDown(event: KeyboardEvent) {
    const usesWrapper = event.currentTarget === event.target;
    if (
      event.key === 'ArrowDown' ||
      (usesWrapper && (event.key === 'Enter' || event.key === ' '))
    ) {
      event.preventDefault();
      void this.openMenu();
    } else if (event.key === 'Escape' && this.open) {
      event.preventDefault();
      this.open = false;
    }
  }

  private onMenuKeyDown(event: KeyboardEvent) {
    const items = Array.from(
      this.shadowRoot?.querySelectorAll<HTMLButtonElement>('.item:not(:disabled)') ?? []
    );
    if (items.length === 0) return;

    const currentIndex = Math.max(0, items.indexOf(event.target as HTMLButtonElement));
    let nextIndex = currentIndex;

    if (event.key === 'ArrowDown') nextIndex = (currentIndex + 1) % items.length;
    else if (event.key === 'ArrowUp') nextIndex = (currentIndex - 1 + items.length) % items.length;
    else if (event.key === 'Home') nextIndex = 0;
    else if (event.key === 'End') nextIndex = items.length - 1;
    else if (event.key === 'Escape') {
      event.preventDefault();
      this.open = false;
      this.focusTrigger();
      return;
    } else if (event.key === 'Tab') {
      this.open = false;
      return;
    } else {
      return;
    }

    event.preventDefault();
    items[nextIndex].focus();
  }

  private onSelect(item: DropdownItem) {
    if (item.disabled) return;
    this.open = false;
    this.dispatchEvent(
      new CustomEvent('select', {
        detail: { key: item.key, item },
        bubbles: true,
        composed: true,
      })
    );
    this.focusTrigger();
  }

  updated(changedProperties: Map<PropertyKey, unknown>) {
    if (changedProperties.has('open')) this.updateTriggerAria();
  }

  render() {
    return html`
      <div
        class="trigger"
        role=${this.triggerNeedsTabStop ? 'button' : nothing}
        tabindex=${this.triggerNeedsTabStop && !this.disabled ? 0 : -1}
        aria-haspopup=${this.triggerNeedsTabStop ? 'menu' : nothing}
        aria-expanded=${this.triggerNeedsTabStop ? String(this.open) : nothing}
        aria-controls=${this.triggerNeedsTabStop ? this.menuId : nothing}
        @click=${this.toggle}
        @keydown=${this.onTriggerKeyDown}
      >
        <slot @slotchange=${this.onSlotChange}></slot>
      </div>
      ${this.open
        ? html`
            <div id=${this.menuId} class="menu" role="menu" @keydown=${this.onMenuKeyDown}>
              ${this.mergedItems.map(
                (item) => html`
                  <button
                    type="button"
                    role="menuitem"
                    class="item ${item.danger ? 'danger' : ''}"
                    ?disabled=${Boolean(item.disabled)}
                    @click=${() => this.onSelect(item)}
                  >
                    ${item.label}
                  </button>
                `
              )}
            </div>
          `
        : nothing}
    `;
  }
}

export type { DropdownItem };
