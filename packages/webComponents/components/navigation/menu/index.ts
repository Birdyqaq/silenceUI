import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { baseControlStyles } from '../../_shared/styles';
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
    `
  ];

  private get mergedItems() {
    if (this.items.length > 0) return this.items;
    return parseJsonArray<MenuItem>(this.itemsJson, []);
  }

  private onSelect(item: MenuItem) {
    this.activeKey = item.key;
    this.dispatchEvent(
      new CustomEvent('select', {
        detail: item,
        bubbles: true,
        composed: true
      })
    );
  }

  render() {
    return html`
      <nav class="menu" aria-label="menu">
        ${this.mergedItems.map(
          (item) => html`
            <button
              type="button"
              class="item ${item.key === this.activeKey ? 'active' : ''}"
              @click=${() => this.onSelect(item)}>
              <span class="icon">${item.icon ?? ''}</span>
              ${this.collapsed ? '' : html`<span>${item.label}</span>`}
            </button>
          `
        )}
      </nav>
    `;
  }
}

export type { MenuItem };
