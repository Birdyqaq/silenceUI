import { LitElement, css, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';
import { getDeepActiveElement } from '../../_shared/overlay';
import { baseControlStyles, focusRingStyles } from '../../_shared/styles';

export interface SortableListItem {
  key: string;
  label: string;
}

export interface SortableListChangeDetail {
  items: SortableListItem[];
  key: string;
  fromIndex: number;
  toIndex: number;
}

@customElement('su-sortable-list')
export class SuSortableList extends LitElement {
  @property({ attribute: false }) items: readonly SortableListItem[] = [];
  @property({ type: String }) label = '可排序列表';
  @property({ type: Boolean }) disabled = false;
  @state() private announcement = '';
  private drag?: { item: SortableListItem; source: readonly SortableListItem[] };

  static styles = [
    baseControlStyles,
    focusRingStyles,
    css`
      :host {
        display: block;
      }
      ol {
        list-style: none;
        margin: 0;
        padding: 0;
        border-block-start: 1px solid var(--su-border-color);
      }
      li {
        display: grid;
        grid-template-columns: auto minmax(0, 1fr) auto;
        align-items: center;
        gap: 8px;
        border-block-end: 1px solid var(--su-border-color);
        padding: 6px 2px;
      }
      .handle {
        display: inline-flex;
        padding: 4px;
        color: var(--su-text-2);
      }
      .handle[draggable='true'] {
        cursor: grab;
      }
      .name {
        overflow-wrap: anywhere;
      }
      .controls {
        display: flex;
        gap: 4px;
      }
      button {
        font: inherit;
        color: inherit;
        background: var(--su-bg-card);
        border: 1px solid var(--su-border-color);
        border-radius: var(--su-radius-sm);
        min-width: 32px;
        min-height: 32px;
        cursor: pointer;
      }
      button:disabled {
        opacity: 0.45;
        cursor: default;
      }
      .status {
        position: absolute;
        clip-path: inset(50%);
        width: 1px;
        height: 1px;
        overflow: hidden;
      }
    `,
  ];

  private get canReorder() {
    const keys = this.items.map((item) => item.key);
    return !this.disabled && new Set(keys).size === keys.length;
  }

  private move(item: SortableListItem, toIndex: number, direction?: number) {
    if (!this.canReorder) return;
    const fromIndex = this.items.indexOf(item);
    if (fromIndex < 0 || toIndex < 0 || toIndex >= this.items.length || toIndex === fromIndex)
      return;

    const items = [...this.items];
    items.splice(fromIndex, 1);
    items.splice(toIndex, 0, item);
    const previousFocus = this.shadowRoot?.activeElement;
    this.items = items;
    this.announcement = `${item.label} 已移到第 ${toIndex + 1} 位`;
    this.dispatchEvent(
      new CustomEvent<SortableListChangeDetail>('change', {
        detail: { items: [...items], key: item.key, fromIndex, toIndex },
        bubbles: true,
        composed: true,
      })
    );

    if (!(previousFocus instanceof HTMLButtonElement) || direction === undefined) return;
    void this.updateComplete.then(() => {
      const active = getDeepActiveElement();
      if (!this.isConnected || (active !== previousFocus && active !== this.ownerDocument.body))
        return;
      const row = [...this.renderRoot.querySelectorAll('li')].find(
        (element) => element.dataset.key === item.key
      );
      const preferred = row?.querySelector<HTMLButtonElement>(
        `button[data-direction="${direction}"]:not(:disabled)`
      );
      (preferred ?? row?.querySelector<HTMLButtonElement>('button:not(:disabled)'))?.focus();
    });
  }

  private startDrag(event: DragEvent, item: SortableListItem) {
    if (!this.canReorder || !this.items.includes(item) || !event.dataTransfer) {
      event.preventDefault();
      return;
    }
    this.drag = { item, source: this.items };
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/plain', item.key);
  }

  private canDrop() {
    return this.canReorder && this.drag?.source === this.items;
  }

  private drop(event: DragEvent, target: SortableListItem) {
    if (!this.canDrop()) return;
    event.preventDefault();
    const { item } = this.drag!;
    this.drag = undefined;
    this.move(item, this.items.indexOf(target));
  }

  disconnectedCallback() {
    this.drag = undefined;
    super.disconnectedCallback();
  }

  render() {
    const enabled = this.canReorder;
    return html`
      <ol aria-label=${this.label}>
        ${repeat(
          this.items,
          (item, index) => (enabled ? item.key : index),
          (item, index) => html`
            <li
              data-key=${item.key}
              part="item"
              @dragover=${(event: DragEvent) => {
                if (this.canDrop()) event.preventDefault();
              }}
              @drop=${(event: DragEvent) => this.drop(event, item)}
            >
              <span
                class="handle"
                aria-hidden="true"
                draggable=${String(enabled)}
                @dragstart=${(event: DragEvent) => this.startDrag(event, item)}
                @dragend=${() => {
                  this.drag = undefined;
                }}
                >⠿</span
              >
              <span class="name">${item.label}</span>
              <div class="controls">
                <button
                  type="button"
                  data-direction="-1"
                  aria-label=${`上移 ${item.label}`}
                  ?disabled=${!enabled || index === 0}
                  @click=${() => this.move(item, index - 1, -1)}
                >
                  ↑
                </button>
                <button
                  type="button"
                  data-direction="1"
                  aria-label=${`下移 ${item.label}`}
                  ?disabled=${!enabled || index === this.items.length - 1}
                  @click=${() => this.move(item, index + 1, 1)}
                >
                  ↓
                </button>
              </div>
            </li>
          `
        )}
      </ol>
      ${this.items.length ? '' : html`<p>暂无条目</p>`}
      <div role="status" class="status">${this.announcement}</div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'su-sortable-list': SuSortableList;
  }
}
