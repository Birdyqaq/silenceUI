import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';
import { baseControlStyles, focusRingStyles } from '../../_shared/styles';

export interface AttachmentListItem {
  id: string;
  name: string;
  description?: string;
}

@customElement('su-attachment-list')
export class SuAttachmentList extends LitElement {
  @property({ attribute: false }) items: readonly AttachmentListItem[] = [];
  @property({ type: String }) label = '已保存附件';
  @property({ type: Boolean }) removable = false;
  @property({ type: Boolean }) disabled = false;

  static styles = [
    baseControlStyles,
    focusRingStyles,
    css`
      :host {
        display: block;
      }
      ul {
        list-style: none;
        margin: 0;
        padding: 0;
        border-block-start: 1px solid var(--su-border-color);
      }
      li {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 8px;
        padding: 10px 4px;
        border-block-end: 1px solid var(--su-border-color);
      }
      .file {
        min-width: min(100%, 160px);
        flex: 1 1 160px;
        overflow-wrap: anywhere;
      }
      small,
      p {
        color: var(--su-text-2);
      }
      small {
        display: block;
        margin-block-start: 4px;
      }
      .actions {
        display: flex;
        gap: 6px;
      }
      button {
        font: inherit;
        color: inherit;
        background: var(--su-bg-card);
        border: 1px solid var(--su-border-color);
        border-radius: var(--su-radius-sm);
        padding: 4px 8px;
        cursor: pointer;
      }
      button:disabled {
        opacity: 0.5;
        cursor: default;
      }
    `,
  ];

  private open(item: AttachmentListItem) {
    if (this.disabled || !this.items.includes(item)) return;
    this.dispatchEvent(
      new CustomEvent('attachment-open', {
        detail: { item },
        bubbles: true,
        composed: true,
      })
    );
  }

  private requestRemove(item: AttachmentListItem) {
    if (this.disabled || !this.removable || !this.items.includes(item)) return;
    this.dispatchEvent(
      new CustomEvent('attachment-remove', {
        detail: { item },
        bubbles: true,
        composed: true,
      })
    );
  }

  render() {
    return html`<section aria-label=${this.label}>
      ${this.items.length
        ? html`<ul aria-label=${this.label}>
            ${repeat(
              this.items,
              (item) => item.id,
              (item) =>
                html`<li part="item">
                  <div class="file">
                    <strong>${item.name}</strong>
                    ${item.description ? html`<small>${item.description}</small>` : ''}
                  </div>
                  <div class="actions">
                    <button
                      type="button"
                      ?disabled=${this.disabled}
                      aria-label=${`打开 ${item.name}`}
                      @click=${() => this.open(item)}
                    >
                      打开
                    </button>
                    ${this.removable
                      ? html`<button
                          type="button"
                          ?disabled=${this.disabled}
                          aria-label=${`移除 ${item.name}`}
                          @click=${() => this.requestRemove(item)}
                        >
                          移除
                        </button>`
                      : ''}
                  </div>
                </li>`
            )}
          </ul>`
        : html`<p>暂无附件</p>`}
    </section>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'su-attachment-list': SuAttachmentList;
  }
}
