import { LitElement, css, html, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { baseControlStyles } from '../../_shared/styles';
import { parseJsonArray } from '../../_shared/utils';

interface DropdownItem {
  key: string;
  label: string;
  disabled?: boolean;
  danger?: boolean;
}

@customElement('su-dropdown')
export class SuDropdown extends LitElement {
  @property({ type: Array, attribute: false }) items: DropdownItem[] = [];
  @property({ type: String }) itemsJson = '';

  @state() private open = false;

  static styles = [
    baseControlStyles,
    css`
      :host {
        display: inline-block;
        position: relative;
      }

      .trigger {
        cursor: pointer;
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
    `
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

  private toggle() {
    this.open = !this.open;
  }

  private onSelect(item: DropdownItem) {
    if (item.disabled) return;
    this.open = false;
    this.dispatchEvent(
      new CustomEvent('select', {
        detail: { key: item.key, item },
        bubbles: true,
        composed: true
      })
    );
  }

  render() {
    return html`
      <div class="trigger" @click=${this.toggle}>
        <slot></slot>
      </div>
      ${this.open
        ? html`
            <div class="menu" role="menu">
              ${this.mergedItems.map(
                (item) => html`
                  <button
                    type="button"
                    role="menuitem"
                    class="item ${item.danger ? 'danger' : ''}"
                    ?disabled=${Boolean(item.disabled)}
                    @click=${() => this.onSelect(item)}>
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
