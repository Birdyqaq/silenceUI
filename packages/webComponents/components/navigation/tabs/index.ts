import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';
import { baseControlStyles, focusRingStyles } from '../../_shared/styles';
import { parseJsonArray } from '../../_shared/utils';

interface TabItem {
  key: string;
  label: string;
  disabled?: boolean;
  closable?: boolean;
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
  @property({ type: Boolean }) closable = false;
  @property({ type: String }) label = '标签页';

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
        overflow-x: auto;
      }

      .tab-wrap {
        display: flex;
        flex-shrink: 0;
        align-items: center;
      }
      .close {
        border: 0;
        background: transparent;
        color: var(--su-text-2);
        cursor: pointer;
        padding: 6px;
      }
      .close:hover {
        color: var(--su-color-error);
      }
      [hidden] {
        display: none;
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
        transition:
          color 0.15s ease,
          border-color 0.15s ease;
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
    const items =
      Array.isArray(this.items) && this.items.length > 0
        ? this.items
        : parseJsonArray<TabItem>(this.itemsJson, []);
    const seen = new Set<string>();
    return items.filter((item) => {
      if (
        !item ||
        typeof item.key !== 'string' ||
        !item.key ||
        typeof item.label !== 'string' ||
        seen.has(item.key)
      )
        return false;
      seen.add(item.key);
      return true;
    });
  }

  private canClose(item: TabItem) {
    return !item.disabled && (item.closable ?? this.closable);
  }

  /** 穿透开放 Shadow DOM 检查焦点，避免嵌套宿主误判或抢走业务弹层焦点。 */
  private canRestoreFocus() {
    let active = this.ownerDocument.activeElement;
    while (active?.shadowRoot?.activeElement) active = active.shadowRoot.activeElement;
    if (
      active === this.ownerDocument.body ||
      active === this ||
      (active && this.renderRoot.contains(active))
    )
      return true;
    let root = this.getRootNode();
    while (root instanceof ShadowRoot) {
      if (active === root.host) return true;
      root = root.host.getRootNode();
    }
    return false;
  }

  /** 允许宿主取消关闭；关闭当前页优先选择右侧可用页，再选择左侧。 */
  private onClose(item: TabItem) {
    const key = item.key;
    const latest = this.mergedItems.find((entry) => entry.key === key);
    if (!latest || !this.canClose(latest)) return;
    item = latest;
    const restoreFocus = Boolean(this.shadowRoot?.activeElement?.closest('.nav'));
    const allowed = this.dispatchEvent(
      new CustomEvent('close', {
        detail: { key, item },
        cancelable: true,
        bubbles: true,
        composed: true,
      })
    );
    if (!allowed) return;
    const items = this.mergedItems;
    const index = items.findIndex((entry) => entry.key === key);
    if (index < 0 || !this.canClose(items[index])) return;
    const previous = this.currentKey;
    const remaining = items.filter((entry) => entry.key !== key);
    const next =
      previous === key
        ? (items.slice(index + 1).find((entry) => !entry.disabled) ??
          items
            .slice(0, index)
            .reverse()
            .find((entry) => !entry.disabled))
        : remaining.find((entry) => entry.key === previous);
    // 关闭后转为 property 数据，清空 JSON 以防最后一项关闭后重新出现。
    this.items = remaining;
    this.itemsJson = '';
    this.activeKey = next?.key ?? '';
    if (previous !== this.activeKey)
      this.dispatchEvent(
        new CustomEvent('change', {
          detail: { key: this.activeKey, item: next },
          bubbles: true,
          composed: true,
        })
      );
    void this.updateComplete.then(() => {
      // 业务回调可能打开对话框；只有焦点仍在本组件或因移除回到 body 时才恢复。
      if (this.isConnected && restoreFocus && this.canRestoreFocus())
        this.renderRoot.querySelector<HTMLButtonElement>('.tab[tabindex="0"]')?.focus();
    });
  }

  private get currentKey() {
    const enabledItems = this.mergedItems.filter((item) => !item.disabled);
    return (
      enabledItems.find((item) => item.key === this.activeKey)?.key ?? enabledItems[0]?.key ?? ''
    );
  }

  private onSelect(item: TabItem) {
    const latest = this.mergedItems.find((entry) => entry.key === item.key);
    if (!latest) return;
    item = latest;
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
    const target = event.target as HTMLElement;
    if (!target.matches('.tab')) return;
    const items = this.mergedItems.filter((item) => !item.disabled);
    if (items.length === 0) return;

    if (event.key === 'Delete') {
      const item = items.find((entry) => entry.key === target.dataset.key);
      if (item && this.canClose(item)) {
        event.preventDefault();
        this.onClose(item);
      }
      return;
    }

    const currentIndex = Math.max(
      0,
      items.findIndex((item) => item.key === target.dataset.key)
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
      if (this.isConnected && this.currentKey === nextItem.key && this.canRestoreFocus()) {
        button?.focus();
        button?.scrollIntoView?.({ block: 'nearest', inline: 'nearest' });
      }
    });
  }

  render() {
    const current = this.currentKey;
    const items = this.mergedItems;

    return html`
      <div class="nav" role="tablist" aria-label=${this.label} @keydown=${this.onKeyDown}>
        ${repeat(
          items,
          (item) => item.key,
          (item, index) => html`
            <div class="tab-wrap" role="presentation">
              <button
                id=${`${this.idPrefix}-tab-${index}`}
                data-key=${item.key}
                type="button"
                role="tab"
                aria-selected=${item.key === current ? 'true' : 'false'}
                aria-controls=${`${this.idPrefix}-panel-${index}`}
                tabindex=${item.key === current ? 0 : -1}
                class="tab ${item.key === current ? 'active' : ''}"
                ?disabled=${Boolean(item.disabled)}
                @click=${() => this.onSelect(item)}
              >
                ${item.label}
              </button>
              ${this.canClose(item)
                ? html`<button
                    class="close"
                    type="button"
                    tabindex="-1"
                    aria-label=${`关闭 ${item.label}`}
                    @click=${() => this.onClose(item)}
                  >
                    ×
                  </button>`
                : ''}
            </div>
          `
        )}
      </div>
      ${repeat(
        items,
        (item) => item.key,
        (item, index) =>
          html`<div
            id=${`${this.idPrefix}-panel-${index}`}
            class="panel"
            role="tabpanel"
            tabindex="0"
            aria-labelledby=${`${this.idPrefix}-tab-${index}`}
            ?hidden=${item.key !== current}
          >
            <slot name=${item.key}></slot>
            ${item.key === current ? html`<slot></slot>` : ''}
          </div>`
      )}
    `;
  }
}

export type { TabItem };
