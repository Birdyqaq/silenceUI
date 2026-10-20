import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { baseControlStyles } from '../../_shared/styles';
import { parseJsonArray } from '../../_shared/utils';

interface BreadcrumbItem {
  label: string;
  key?: string;
}

@customElement('su-breadcrumb')
export class SuBreadcrumb extends LitElement {
  @property({ type: Array, attribute: false }) items: BreadcrumbItem[] = [];
  @property({ type: String }) itemsJson = '';
  @property({ type: String }) separator = '/';

  static styles = [
    baseControlStyles,
    css`
      :host {
        display: block;
      }

      nav {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: var(--su-font-size-sm);
      }

      button {
        border: none;
        background: transparent;
        color: var(--su-text-3);
        cursor: pointer;
        padding: 0;
      }

      button:hover {
        color: var(--su-color-primary);
      }

      .current {
        color: var(--su-text-1);
        font-weight: 500;
      }

      .sep {
        color: var(--su-text-3);
      }
    `,
  ];

  private get mergedItems() {
    if (this.items.length > 0) return this.items;
    return parseJsonArray<BreadcrumbItem>(this.itemsJson, []);
  }

  private handleClick(item: BreadcrumbItem, index: number) {
    this.dispatchEvent(
      new CustomEvent('navigate', {
        detail: { item, index },
        bubbles: true,
        composed: true,
      })
    );
  }

  render() {
    const list = this.mergedItems;
    return html`
      <nav aria-label="面包屑">
        ${list.map((item, index) => {
          const isLast = index === list.length - 1;
          return html`
            <button
              class=${isLast ? 'current' : ''}
              aria-current=${isLast ? 'page' : 'false'}
              @click=${() => this.handleClick(item, index)}
            >
              ${item.label}
            </button>
            ${isLast ? '' : html`<span class="sep">${this.separator}</span>`}
          `;
        })}
      </nav>
    `;
  }
}

export type { BreadcrumbItem };
