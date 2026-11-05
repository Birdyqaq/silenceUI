import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';
import { baseControlStyles, focusRingStyles } from '../../_shared/styles';

export interface NotificationCenterItem {
  id: string;
  title: string;
  description?: string;
  time?: string;
  read?: boolean;
}

@customElement('su-notification-center')
export class SuNotificationCenter extends LitElement {
  @property({ attribute: false }) items: readonly NotificationCenterItem[] = [];
  @property({ type: Number }) page = 1;
  @property({ type: Number, attribute: 'total-pages' }) totalPages = 1;
  @property({ type: Boolean }) loading = false;
  @property({ type: String }) label = '通知中心';

  static styles = [
    baseControlStyles,
    focusRingStyles,
    css`
      :host {
        display: block;
        min-width: 0;
      }
      ul {
        margin: 0;
        padding: 0;
        list-style: none;
      }
      li {
        padding: 12px 0;
        border-bottom: 1px solid var(--su-border-color);
        overflow-wrap: anywhere;
      }
      li p {
        margin: 6px 0;
        color: var(--su-text-2);
      }
      header,
      nav {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 8px;
      }
      nav {
        margin-top: 12px;
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
      .unread {
        color: var(--su-color-primary);
      }
    `,
  ];

  private changePage(page: number) {
    if (this.loading) return;
    this.dispatchEvent(
      new CustomEvent('page-change', {
        detail: { page },
        bubbles: true,
        composed: true,
      })
    );
  }

  private markRead(id: string) {
    if (this.loading || !this.items.some((item) => item.id === id && !item.read)) return;
    this.dispatchEvent(
      new CustomEvent('read-request', {
        detail: { id },
        bubbles: true,
        composed: true,
      })
    );
  }

  render() {
    const total = Number.isSafeInteger(this.totalPages) ? Math.max(1, this.totalPages) : 1;
    const page = Number.isSafeInteger(this.page) ? Math.max(1, Math.min(this.page, total)) : 1;
    return html`<section aria-label=${this.label}>
      <div role="status">
        ${this.loading ? '正在加载通知' : this.items.length ? '' : '暂无通知'}
      </div>
      <ul aria-busy=${String(this.loading)}>
        ${repeat(
          this.items,
          (item) => item.id,
          (item) =>
            html`<li part="item">
              <header>
                <strong>${item.title}</strong>
                <span class=${item.read ? '' : 'unread'}>${item.read ? '已读' : '未读'}</span>
              </header>
              ${item.description ? html`<p>${item.description}</p>` : ''}
              ${item.time ? html`<p>${item.time}</p>` : ''}
              ${item.read
                ? ''
                : html`<button
                    type="button"
                    ?disabled=${this.loading}
                    aria-label=${`标记已读：${item.title}`}
                    @click=${() => this.markRead(item.id)}
                  >
                    标记已读
                  </button>`}
            </li>`
        )}
      </ul>
      <nav aria-label="通知分页">
        <button
          type="button"
          ?disabled=${this.loading || page <= 1}
          @click=${() => this.changePage(page - 1)}
        >
          上一页
        </button>
        <span aria-live="polite">${page} / ${total}</span>
        <button
          type="button"
          ?disabled=${this.loading || page >= total}
          @click=${() => this.changePage(page + 1)}
        >
          下一页
        </button>
      </nav>
    </section>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'su-notification-center': SuNotificationCenter;
  }
}
