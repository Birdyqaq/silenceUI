import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { baseControlStyles } from '../../_shared/styles';
import { parseJsonArray } from '../../_shared/utils';

interface TabItem {
  key: string;
  label: string;
  disabled?: boolean;
}

/**
 * 标签页。面板内容通过 slot 传入，slot 名与 tab 的 key 对应：
 * <su-tabs .items=${[{key:'a',label:'A'}]}><div slot="a">内容A</div></su-tabs>
 */
@customElement('su-tabs')
export class SuTabs extends LitElement {
  @property({ type: Array, attribute: false }) items: TabItem[] = [];
  @property({ type: String }) itemsJson = '';
  @property({ type: String }) activeKey = '';

  static styles = [
    baseControlStyles,
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
    `
  ];

  private get mergedItems() {
    if (this.items.length > 0) return this.items;
    return parseJsonArray<TabItem>(this.itemsJson, []);
  }

  private get currentKey() {
    return this.activeKey || this.mergedItems[0]?.key || '';
  }

  private onSelect(item: TabItem) {
    if (item.disabled || item.key === this.currentKey) return;
    this.activeKey = item.key;
    this.dispatchEvent(
      new CustomEvent('change', {
        detail: { key: item.key, item },
        bubbles: true,
        composed: true
      })
    );
  }

  render() {
    const current = this.currentKey;
    return html`
      <div class="nav" role="tablist">
        ${this.mergedItems.map(
          (item) => html`
            <button
              type="button"
              role="tab"
              aria-selected=${item.key === current ? 'true' : 'false'}
              class="tab ${item.key === current ? 'active' : ''}"
              ?disabled=${Boolean(item.disabled)}
              @click=${() => this.onSelect(item)}>
              ${item.label}
            </button>
          `
        )}
      </div>
      <div class="panel" role="tabpanel">
        <slot name=${current}></slot>
        <slot></slot>
      </div>
    `;
  }
}

export type { TabItem };
