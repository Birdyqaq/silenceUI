import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { baseControlStyles, focusRingStyles } from '../../_shared/styles';
import { parseJsonArray } from '../../_shared/utils';

interface MenuItem {
  key: string;
  label: string;
  icon?: string;
}

@customElement('su-menu')
export class SuMenu extends LitElement {
  @property({ type: Array, attribute: false }) items: MenuItem[] = [];
  @property({ type: String }) itemsJson = '';
  @property({ type: String }) activeKey = '';
  @property({ type: Boolean }) collapsed = false;

  static styles = [
    baseControlStyles,
    focusRingStyles,
    css`
      :host {
        display: block;
      }

      .menu {
        display: grid;
        gap: 6px;
      }

      .item {
        display: flex;
        align-items: center;
        gap: 10px;
        border: none;
        border-radius: var(--su-radius-sm);
        background: transparent;
        color: var(--su-text-2);
        padding: 9px 10px;
        cursor: pointer;
        text-align: left;
        width: 100%;
      }

      .item:hover {
        background: rgba(var(--su-color-primary-rgb), 0.08);
        color: var(--su-color-primary-hover);
      }

      .item.active {
        background: rgba(var(--su-color-primary-rgb), 0.14);
        color: var(--su-color-primary);
        font-weight: 600;
      }

      .icon {
        width: 16px;
        text-align: center;
      }
    `,
  ];

  private get mergedItems() {
    if (this.items.length > 0) return this.items;
    return parseJsonArray<MenuItem>(this.itemsJson, []);
  }

  private get currentKey() {
    const list = this.mergedItems;
    return list.some((item) => item.key === this.activeKey) ? this.activeKey : (list[0]?.key ?? '');
  }

  private onSelect(item: MenuItem) {
    this.activeKey = item.key;
    this.dispatchEvent(
      new CustomEvent('select', {
        detail: item,
        bubbles: true,
        composed: true,
      })
    );
  }

  private onKeyDown(event: KeyboardEvent) {
    const items = Array.from(this.shadowRoot?.querySelectorAll<HTMLButtonElement>('.item') ?? []);
    if (items.length === 0) return;

    const currentIndex = Math.max(0, items.indexOf(event.target as HTMLButtonElement));
    let nextIndex = currentIndex;

    if (event.key === 'ArrowDown') nextIndex = (currentIndex + 1) % items.length;
    else if (event.key === 'ArrowUp') nextIndex = (currentIndex - 1 + items.length) % items.length;
    else if (event.key === 'Home') nextIndex = 0;
    else if (event.key === 'End') nextIndex = items.length - 1;
    else return;

    event.preventDefault();
    items[nextIndex].focus();
  }

  render() {
    const currentKey = this.currentKey;
    return html`
      <div class="menu" role="menu" aria-label="主导航" @keydown=${this.onKeyDown}>
        ${this.mergedItems.map(
          (item, index) => html`
            <button
              type="button"
              role="menuitem"
              class="item ${item.key === this.activeKey ? 'active' : ''}"
              aria-current=${item.key === currentKey ? 'page' : 'false'}
              tabindex=${item.key === currentKey || (!currentKey && index === 0) ? 0 : -1}
              @click=${() => this.onSelect(item)}
            >
              <span class="icon" aria-hidden="true">${item.icon ?? ''}</span>
              ${this.collapsed ? '' : html`<span>${item.label}</span>`}
            </button>
          `
        )}
      </nav>
    `;
  }
}

export type { MenuItem };
