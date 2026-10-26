import { LitElement, css, html, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { baseControlStyles, focusRingStyles } from '../../_shared/styles';
import { parseJsonArray } from '../../_shared/utils';
import '../../icon';

interface MenuItem {
  key: string;
  label: string;
  icon?: string;
  iconName?: string;
  disabled?: boolean;
  children?: MenuItem[];
}

@customElement('su-menu')
export class SuMenu extends LitElement {
  @property({ type: Array, attribute: false }) items: MenuItem[] = [];
  @property({ type: String }) itemsJson = '';
  @property({ type: String }) activeKey = '';
  @property({ type: Boolean }) collapsed = false;
  @property({ type: Array, attribute: false }) expandedKeys: string[] = [];
  @state() private focusedKey = '';

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
      .item:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
    `,
  ];

  private get mergedItems() {
    if (this.items.length > 0) return this.items;
    return parseJsonArray<MenuItem>(this.itemsJson, []);
  }

  private get currentKey() {
    const list = this.visibleItems.map(({ item }) => item).filter((item) => !item.disabled);
    return list.some((item) => item.key === this.activeKey) ? this.activeKey : (list[0]?.key ?? '');
  }

  private get visibleItems() {
    const result: { item: MenuItem; level: number; parent?: string }[] = [];
    const seen = new Set<MenuItem>();
    const visit = (items: MenuItem[], level: number, parent?: string) => {
      if (!Array.isArray(items)) return;
      items.forEach((item) => {
        if (
          !item ||
          typeof item.key !== 'string' ||
          typeof item.label !== 'string' ||
          seen.has(item)
        )
          return;
        seen.add(item);
        result.push({ item, level, parent });
        if (!item.disabled && this.expandedKeys.includes(item.key))
          visit(item.children ?? [], level + 1, item.key);
      });
    };
    visit(this.mergedItems, 0);
    return result;
  }

  private toggle(item: MenuItem) {
    if (item.disabled || !item.children?.length) return;
    const expanded = !this.expandedKeys.includes(item.key);
    this.expandedKeys = expanded
      ? [...this.expandedKeys, item.key]
      : this.expandedKeys.filter((key) => key !== item.key);
    this.dispatchEvent(
      new CustomEvent('expand', {
        detail: { key: item.key, expanded },
        bubbles: true,
        composed: true,
      })
    );
  }

  private onSelect(item: MenuItem) {
    if (item.disabled) return;
    if (item.children?.length) {
      this.toggle(item);
      return;
    }
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
    const items = Array.from(
      this.shadowRoot?.querySelectorAll<HTMLButtonElement>('.item:not(:disabled)') ?? []
    );
    if (items.length === 0) return;

    const currentIndex = Math.max(0, items.indexOf(event.target as HTMLButtonElement));
    let nextIndex = currentIndex;
    const entry = this.visibleItems.find(
      ({ item }) => item.key === items[currentIndex].dataset.key
    );
    if (entry && (event.key === 'ArrowRight' || event.key === 'ArrowLeft')) {
      event.preventDefault();
      if (event.key === 'ArrowRight') {
        if (entry.item.children?.length && !this.expandedKeys.includes(entry.item.key))
          this.toggle(entry.item);
        else if (entry.item.children?.length) {
          const child = this.visibleItems.find(
            ({ item, parent }) => parent === entry.item.key && !item.disabled
          );
          if (child) items.find((item) => item.dataset.key === child.item.key)?.focus();
        }
      } else if (this.expandedKeys.includes(entry.item.key)) this.toggle(entry.item);
      else items.find((item) => item.dataset.key === entry.parent)?.focus();
      return;
    }

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
    const visible = this.visibleItems;
    const focusKey = visible.some(({ item }) => item.key === this.focusedKey && !item.disabled)
      ? this.focusedKey
      : currentKey;
    return html`
      <div class="menu" role="menu" aria-label="主导航" @keydown=${this.onKeyDown}>
        ${visible.map(
          ({ item, level }) => html`
            <button
              type="button"
              role="menuitem"
              class="item ${item.key === currentKey ? 'active' : ''}"
              data-key=${item.key}
              style=${`padding-left: ${10 + level * 16}px`}
              ?disabled=${Boolean(item.disabled)}
              aria-expanded=${item.children?.length
                ? String(this.expandedKeys.includes(item.key))
                : nothing}
              aria-label=${item.label}
              title=${this.collapsed ? item.label : ''}
              aria-current=${item.key === currentKey ? 'page' : 'false'}
              tabindex=${item.key === focusKey ? 0 : -1}
              @focus=${() => {
                this.focusedKey = item.key;
              }}
              @click=${() => this.onSelect(item)}
            >
              <span class="icon" aria-hidden="true"
                >${item.iconName
                  ? html`<su-icon .name=${item.iconName}></su-icon>`
                  : (item.icon ?? (this.collapsed ? item.label.slice(0, 1) : ''))}</span
              >
              ${this.collapsed ? '' : html`<span>${item.label}</span>`}
              ${item.children?.length
                ? html`<su-icon
                    name=${this.expandedKeys.includes(item.key) ? 'chevron-down' : 'chevron-right'}
                  ></su-icon>`
                : nothing}
            </button>
          `
        )}
      </div>
    `;
  }
}

export type { MenuItem };
