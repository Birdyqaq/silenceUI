import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { baseControlStyles, focusRingStyles } from '../../_shared/styles';
import { parseJsonArray } from '../../_shared/utils';

interface TabItem {
  key: string;
  label: string;
  disabled?: boolean;
}

let tabsInstanceId = 0;

/**
 * 标签页。面板内容通过 slot 传入，slot 名与 tab 的 key 对应：
 * <su-tabs .items=${[{key:'a',label:'A'}]}><div slot="a">内容A</div></su-tabs>
 */
@customElement('su-tabs')
export class SuTabs extends LitElement {
  @property({ type: Array, attribute: false }) items: TabItem[] = [];
  @property({ type: String }) itemsJson = '';
  @property({ type: String }) activeKey = '';

  private readonly idPrefix = `su-tabs-${++tabsInstanceId}`;

  static styles = [
    baseControlStyles,
    focusRingStyles,
    css`
      :host {
        display: block;
      }

      .nav {
        display: flex;
        gap: 4px;
        border-bottom: 1px solid var(--su-border-color);
      }

      .tab {
        border: none;
        background: transparent;
        cursor: pointer;
        padding: 10px 14px;
        font-size: var(--su-font-size-md);
        color: var(--su-text-2);
        border-bottom: 2px solid transparent;
        margin-bottom: -1px;
        transition: color 0.15s ease, border-color 0.15s ease;
      }

      .tab:hover:not(:disabled) {
        color: var(--su-color-primary);
      }

      .tab.active {
        color: var(--su-color-primary);
        border-bottom-color: var(--su-color-primary);
        font-weight: 600;
      }

      .tab:disabled {
        color: var(--su-text-3);
        cursor: not-allowed;
        opacity: 0.6;
      }

      .panel {
        padding: 14px 0;
      }
    `,
  ];

  private get mergedItems() {
    if (this.items.length > 0) return this.items;
    return parseJsonArray<TabItem>(this.itemsJson, []);
  }

  private get currentKey() {
    const enabledItems = this.mergedItems.filter((item) => !item.disabled);
    return (
      enabledItems.find((item) => item.key === this.activeKey)?.key ?? enabledItems[0]?.key ?? ''
    );
  }

  private onSelect(item: TabItem) {
    if (item.disabled || item.key === this.currentKey) return;
    this.activeKey = item.key;
    this.dispatchEvent(
      new CustomEvent('change', {
        detail: { key: item.key, item },
        bubbles: true,
        composed: true,
      })
    );
  }

  private onKeyDown(event: KeyboardEvent) {
    const items = this.mergedItems.filter((item) => !item.disabled);
    if (items.length === 0) return;

    const currentIndex = Math.max(
      0,
      items.findIndex((item) => item.key === this.currentKey)
    );
    let nextIndex = currentIndex;

    if (event.key === 'ArrowRight') nextIndex = (currentIndex + 1) % items.length;
    else if (event.key === 'ArrowLeft')
      nextIndex = (currentIndex - 1 + items.length) % items.length;
    else if (event.key === 'Home') nextIndex = 0;
    else if (event.key === 'End') nextIndex = items.length - 1;
    else return;

    event.preventDefault();
    const nextItem = items[nextIndex];
    this.onSelect(nextItem);
    void this.updateComplete.then(() => {
      const button = Array.from(
        this.shadowRoot?.querySelectorAll<HTMLButtonElement>('.tab') ?? []
      ).find((item) => item.dataset.key === nextItem.key);
      button?.focus();
    });
  }

  render() {
    const current = this.currentKey;
    const currentIndex = this.mergedItems.findIndex((item) => item.key === current);
    const panelId = `${this.idPrefix}-panel`;

    return html`
      <div class="nav" role="tablist" @keydown=${this.onKeyDown}>
        ${this.mergedItems.map(
          (item, index) => html`
            <button
              id=${`${this.idPrefix}-tab-${index}`}
              data-key=${item.key}
              type="button"
              role="tab"
              aria-selected=${item.key === current ? 'true' : 'false'}
              aria-controls=${panelId}
              tabindex=${item.key === current ? 0 : -1}
              class="tab ${item.key === current ? 'active' : ''}"
              ?disabled=${Boolean(item.disabled)}
              @click=${() => this.onSelect(item)}
            >
              ${item.label}
            </button>
          `
        )}
      </div>
      <div
        id=${panelId}
        class="panel"
        role="tabpanel"
        aria-labelledby=${currentIndex >= 0 ? `${this.idPrefix}-tab-${currentIndex}` : ''}
      >
        <slot name=${current}></slot>
        <slot></slot>
      </div>
    `;
  }
}

export type { TabItem };
