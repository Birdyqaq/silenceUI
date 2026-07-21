import { LitElement, css, html, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { baseControlStyles } from '../../_shared/styles';
import { parseJsonArray } from '../../_shared/utils';

interface DescriptionItem {
  label: string;
  value: string;
}

@customElement('su-descriptions')
export class SuDescriptions extends LitElement {
  @property({ type: Array, attribute: false }) items: DescriptionItem[] = [];
  @property({ type: String }) itemsJson = '';
  @property({ type: String }) header = '';
  @property({ type: Number }) column = 2;
  @property({ type: Boolean }) bordered = false;

  static styles = [
    baseControlStyles,
    css`
      :host {
        display: block;
      }

      .title {
        font-size: var(--su-font-size-md);
        font-weight: 600;
        margin-bottom: 12px;
      }

      .grid {
        display: grid;
        grid-template-columns: repeat(var(--desc-column, 2), 1fr);
        gap: 12px 24px;
      }

      .item {
        display: flex;
        gap: 8px;
        font-size: var(--su-font-size-sm);
        min-width: 0;
      }

      .label {
        color: var(--su-text-3);
        flex: none;
      }

      .value {
        color: var(--su-text-1);
        word-break: break-all;
      }

      .grid.bordered {
        gap: 0;
        border: 1px solid var(--su-border-color);
        border-radius: var(--su-radius-sm);
        overflow: hidden;
      }

      .grid.bordered .item {
        padding: 10px 12px;
        border-bottom: 1px solid var(--su-border-color);
        border-right: 1px solid var(--su-border-color);
      }

      .grid.bordered .label {
        min-width: 72px;
      }
    `
  ];

  willUpdate() {
    this.style.setProperty('--desc-column', String(Math.max(1, this.column)));
  }

  private get mergedItems() {
    if (this.items.length > 0) return this.items;
    return parseJsonArray<DescriptionItem>(this.itemsJson, []);
  }

  render() {
    return html`
      ${this.header ? html`<div class="title">${this.header}</div>` : nothing}
      <div class="grid ${this.bordered ? 'bordered' : ''}">
        ${this.mergedItems.map(
          (item) => html`
            <div class="item">
              <span class="label">${item.label}</span>
              <span class="value">${item.value}</span>
            </div>
          `
        )}
      </div>
    `;
  }
}

export type { DescriptionItem };
