import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('se-pagination')
export class SePagination extends LitElement {
  @property({ type: Number })
  currentPage = 1;

  @property({ type: Number })
  total = 0;

  @property({ type: Number })
  pageSize = 10;

  static styles = css`
    :host {
      display: block;
      font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
    }

    .pagination {
      margin-top: 12px;
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: var(--su-font-size-sm);
      flex-wrap: wrap;
      color: var(--su-text-2);
    }

    input[type='number'] {
      width: 64px;
      padding: 6px 8px;
      border: 1px solid var(--su-border-color);
      border-radius: var(--su-radius-sm);
      font-size: var(--su-font-size-sm);
      color: var(--su-text-1);
    }

    button {
      border: 1px solid var(--su-border-color);
      border-radius: var(--su-radius-sm);
      padding: 4px 10px;
      background: var(--su-bg-card);
      cursor: pointer;
      color: var(--su-text-1);
    }

    button:hover {
      border-color: var(--su-color-primary);
      color: var(--su-color-primary);
    }

    button:disabled {
      opacity: 0.45;
      cursor: not-allowed;
    }
  `;

  private get totalPages() {
    if (this.total <= 0) return 1;
    return Math.max(1, Math.ceil(this.total / this.pageSize));
  }

  /** 数据变化时校正页码，避免无效页数及被删除的末页残留。 */
  protected willUpdate() {
    this.pageSize =
      Number.isFinite(this.pageSize) && this.pageSize >= 1 ? Math.floor(this.pageSize) : 10;
    this.total = Number.isFinite(this.total) ? Math.max(0, Math.floor(this.total)) : 0;
    this.currentPage = this.clampPage(this.currentPage);
  }

  private clampPage(page: number) {
    return Math.min(this.totalPages, Math.max(1, Number.isFinite(page) ? Math.floor(page) : 1));
  }

  private emitChange(page: number) {
    const next = this.clampPage(page);
    if (next === this.currentPage) return;
    this.currentPage = next;
    this.dispatchEvent(
      new CustomEvent('page-change', {
        detail: { currentPage: next },
        bubbles: true,
        composed: true,
      })
    );
  }

  private handlePageInput(event: Event) {
    const target = event.target as HTMLInputElement;
    this.emitChange(Number(target.value));
    target.value = String(this.currentPage);
  }

  private handlePrevPage() {
    this.emitChange(this.currentPage - 1);
  }

  private handleNextPage() {
    this.emitChange(this.currentPage + 1);
  }

  render() {
    return html`
      <div class="pagination">
        <button type="button" @click="${this.handlePrevPage}" ?disabled="${this.currentPage <= 1}">
          上一页
        </button>
        <label for="page">第</label>
        <input
          type="number"
          id="page"
          name="page"
          min="1"
          max="${this.totalPages}"
          .value="${String(this.currentPage)}"
          @input="${this.handlePageInput}"
        />
        <span>页 / 共 ${this.totalPages} 页</span>
        <button
          type="button"
          @click="${this.handleNextPage}"
          ?disabled="${this.currentPage >= this.totalPages}"
        >
          下一页
        </button>
      </div>
    `;
  }
}
