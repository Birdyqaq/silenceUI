import { LitElement, html, css, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';
import { tableStyles } from './seTable';
import '../pagination/index';

interface Column {
  key: string;
  label: string;
  sortable?: boolean;
  filterable?: boolean;
  width?: string;
  align?: 'left' | 'center' | 'right';
  ellipsis?: boolean;
  fixed?: 'left' | 'right';
  resizable?: boolean;
  minWidth?: number;
  maxWidth?: number;
  formatter?: (value: unknown, row: TableRow, rowIndex: number) => unknown;
}

type TableRow = Record<string, unknown>;
type SortDirection = 'asc' | 'desc' | '';
type ColumnState = Column & { sortDirection?: SortDirection };
type SpanResult = { rowspan?: number; colspan?: number } | [number, number] | void;
type SpanMethodArgs = {
  row: TableRow;
  rowIndex: number;
  column: ColumnState;
  columnIndex: number;
  data: TableRow[];
  columns: ColumnState[];
};
type CellSpan = { rowspan: number; colspan: number };

@customElement('se-table')
export class seTable extends LitElement {
  @property({ type: Object, attribute: false }) filters: Record<string, string> = {};
  @property({ type: Array })

  //数据源 data starts here
  data: TableRow[] = [];

  //列 definitions columns starts here
  @property({ type: Array })
  columns: Column[] = [];

  //没有文件展示 no data text starts here
  @property({ type: String })
  noDataText: string = '暂无数据';

  //表格边框样式 table border style starts here
  @property({ type: String })
  borderStyle: string = '1px solid var(--su-border-color)';

  // 行线 row lines starts here
  @property({ type: Boolean })
  rowLines: boolean = true;

  // 列线 column lines starts here
  @property({ type: Boolean })
  columnLines: boolean = true;

  // 表头背景色（CSS 颜色值，默认跟随主题）
  @property({ type: String })
  theadBgColor: string = '';

  // 表头文字颜色（CSS 颜色值，默认跟随主题）
  @property({ type: String })
  theadTextColor: string = '';

  // 每页显示数量 page size starts here
  @property({ type: Number })
  pageSize: number = 10;

  // 是否启用分页
  @property({ type: Boolean })
  pagination: boolean = true;

  @property({ type: Boolean })
  remote = false;

  @property({ type: Number })
  total = 0;

  // 斑马纹
  @property({ type: Boolean })
  striped: boolean = false;

  // 悬停高亮
  @property({ type: Boolean })
  hoverable: boolean = false;

  // 行高亮固定表头
  @property({ type: Boolean })
  stickyHeader: boolean = false;

  // 表格容器高度
  @property({ type: String })
  height: string = '';

  // 行主键字段
  @property({ type: String })
  rowKey: string = 'id';

  // 行选择（多选）。行的选中标识取自 rowKey 字段
  @property({ type: Boolean })
  selectable: boolean = false;

  // 选中的行 key 集合（可受控）
  @property({ attribute: false })
  selectedKeys: string[] = [];

  @property({ type: Boolean })
  expandable = false;

  @property({ attribute: false })
  expandedKeys: string[] = [];

  @property({ attribute: false })
  rowExpandable?: (row: TableRow, rowIndex: number) => boolean;

  @property({ attribute: false })
  expandedRowRender?: (row: TableRow, rowIndex: number) => unknown;

  // 加载中遮罩
  @property({ type: Boolean })
  loading: boolean = false;

  // 合并单元格回调（仅 JS 赋值）
  @property({ attribute: false })
  spanMethod?: (args: SpanMethodArgs) => SpanResult;

  // 无限滚动
  @property({ type: Boolean })
  infiniteScroll: boolean = false;

  @property({ type: Boolean })
  hasMore: boolean = false;

  @property({ type: Boolean })
  loadingMore: boolean = false;

  @property({ type: Number })
  loadMoreOffset: number = 80;

  @property({ type: String })
  loadMoreText: string = '下拉到底部加载更多';

  @property({ type: String })
  loadingText: string = '加载中...';

  @property({ type: String })
  noMoreText: string = '没有更多数据了';

  // 虚拟滚动（针对大数据）
  @property({ type: Boolean })
  virtualScroll: boolean = false;

  @property({ type: Number })
  virtualThreshold: number = 1000;

  @property({ type: Number })
  virtualRowHeight: number = 44;

  @property({ type: Number })
  virtualBuffer: number = 8;

  // 当前页 current page starts here
  @property({ type: Number })
  currentPage: number = 1;

  // 排序的列 sorted columns starts here
  @state()
  sortedColumns: ColumnState[] = [];

  // 排序后的数据 sorted data starts here
  @state()
  sortedData: TableRow[] = [];

  @state()
  scrollTop: number = 0;

  @state()
  viewportHeight: number = 0;

  @state()
  private loadMorePending: boolean = false;

  @state()
  private columnWidths: Record<string, number> = {};

  private resizeCleanup?: () => void;

  // 排序函数 sort function starts here
  sortColumn: (index: number) => void;

  static styles = [
    tableStyles,
    css`
      .pagination {
        margin-top: 0;
      }

      .table-viewport {
        width: 100%;
        overflow-x: auto;
      }

      .table-viewport.scrollable {
        overflow: auto;
      }

      thead.sticky th {
        position: sticky;
        top: 0;
        z-index: 1;
      }

      thead th {
        cursor: default;
        user-select: none;
      }

      .sort-button {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 0;
        border: none;
        background: transparent;
        color: inherit;
        font: inherit;
        cursor: pointer;
      }

      .sort-button:focus-visible {
        outline: 2px solid var(--su-color-primary);
        outline-offset: 2px;
      }

      .sort-indicator {
        font-size: 12px;
        color: var(--su-text-3);
      }

      thead th.sortable {
        cursor: pointer;
      }

      tbody tr.striped:nth-child(even) {
        background-color: var(--su-bg-page);
      }

      tbody tr.hoverable:hover {
        background-color: var(--su-bg-hover);
      }

      td.ellipsis {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      td.empty {
        text-align: center;
        padding: 32px 8px;
        color: var(--su-text-3);
      }

      .selection-cell {
        width: 40px;
        text-align: center;
      }

      .selection-cell input {
        accent-color: var(--su-color-primary);
        cursor: pointer;
      }

      .expansion-cell {
        width: 40px;
        text-align: center;
      }

      .expansion-cell button {
        color: var(--su-text-1);
        background: var(--su-bg-card);
        border: 1px solid var(--su-border-color);
        border-radius: var(--su-radius-sm);
        cursor: pointer;
      }

      .expansion-cell button:focus-visible {
        outline: 2px solid var(--su-color-primary);
      }

      .expansion-cell button:disabled {
        cursor: not-allowed;
        opacity: 0.5;
      }

      .expanded-row td {
        background: var(--su-bg-page);
        text-align: left;
      }

      .table-wrapper {
        position: relative;
      }

      .loading-overlay {
        position: absolute;
        inset: 0;
        z-index: 5;
        background: var(--su-overlay);
        display: grid;
        place-items: center;
      }

      .loading-spinner {
        width: 26px;
        height: 26px;
        border-radius: 50%;
        border: 3px solid rgba(var(--su-color-primary-rgb), 0.25);
        border-top-color: var(--su-color-primary);
        animation: table-spin 0.8s linear infinite;
      }

      @keyframes table-spin {
        to {
          transform: rotate(360deg);
        }
      }

      .status-line {
        margin-top: 8px;
        text-align: center;
        color: var(--su-text-3);
        font-size: 13px;
      }

      .virtual-spacer td {
        border: none !important;
        padding: 0 !important;
        height: 0;
      }

      th.fixed-column,
      td.fixed-column {
        position: sticky;
        z-index: 2;
        background: var(--su-bg-card);
      }

      thead th.fixed-column {
        z-index: 3;
        background: var(--thead-bg-color, var(--su-bg-hover));
      }

      .fixed-left-edge {
        box-shadow: 4px 0 6px -4px rgba(0, 0, 0, 0.24);
      }

      .fixed-right-edge {
        box-shadow: -4px 0 6px -4px rgba(0, 0, 0, 0.24);
      }

      .column-header {
        position: relative;
      }

      .resize-handle {
        position: absolute;
        top: 0;
        right: -4px;
        width: 8px;
        height: 100%;
        cursor: col-resize;
        touch-action: none;
        z-index: 4;
      }

      .resize-handle:focus-visible {
        outline: 2px solid var(--su-color-primary);
        outline-offset: -2px;
      }
      .column-filter {
        display: block;
        width: 100%;
        min-width: 70px;
        margin-top: 6px;
        padding: 4px;
        color: var(--su-text-1);
        background: var(--su-bg-card);
        border: 1px solid var(--su-border-color);
        border-radius: var(--su-radius-sm);
        font: inherit;
      }
    `,
  ];

  constructor() {
    super();
    this.sortedColumns = [...this.columns];
    this.sortedData = [...this.data];
    this.sortColumn = (index: number) => {
      const col = this.sortedColumns[index];
      if (!col?.sortable) return;

      const nextDirection: SortDirection =
        col.sortDirection === 'asc' ? 'desc' : col.sortDirection === 'desc' ? '' : 'asc';

      // reset directions
      this.sortedColumns = this.sortedColumns.map((c, i) => ({
        ...c,
        sortDirection: i === index ? nextDirection : '',
      }));

      if (this.remote || nextDirection === '') {
        this.sortedData = [...this.filteredData];
      } else {
        this.sortedData = [...this.filteredData].sort((a, b) => {
          const result = this.compareValues(a[col.key], b[col.key]);
          return nextDirection === 'asc' ? result : result * -1;
        });
      }

      this.currentPage = 1;
      this.scrollTop = 0;
      this.resetViewportScroll();

      this.dispatchEvent(
        new CustomEvent('sort-change', {
          detail: { column: col.key, direction: nextDirection },
          bubbles: true,
          composed: true,
        })
      );
    };
  }

  private readonly fallbackRowKeys = new WeakMap<TableRow, string>();
  private nextFallbackKey = 0;

  private filterValue(key: string) {
    return Object.prototype.hasOwnProperty.call(this.filters, key) &&
      typeof this.filters[key] === 'string'
      ? this.filters[key]
      : '';
  }

  private get filteredData() {
    if (this.remote) return this.data;
    return this.data.filter((row) =>
      this.columns.every((column) => {
        const query = this.filterValue(column.key);
        return (
          !column.filterable ||
          !query ||
          String(row[column.key] ?? '')
            .toLocaleLowerCase()
            .includes(query.toLocaleLowerCase())
        );
      })
    );
  }

  private changeFilter(key: string, value: string) {
    this.filters = { ...this.filters, [key]: value };
    this.currentPage = 1;
    this.scrollTop = 0;
    this.resetViewportScroll();
    this.dispatchEvent(
      new CustomEvent('filter-change', {
        detail: { filters: { ...this.filters } },
        bubbles: true,
        composed: true,
      })
    );
  }

  willUpdate(changedProperties: Map<string | number | symbol, unknown>) {
    // 防止非法数值传播到分页切片、虚拟滚动范围与占位高度。
    this.pageSize =
      Number.isFinite(this.pageSize) && this.pageSize >= 1 ? Math.floor(this.pageSize) : 10;
    this.total = Number.isFinite(this.total) ? Math.max(0, Math.floor(this.total)) : 0;
    this.currentPage = Number.isFinite(this.currentPage)
      ? Math.max(1, Math.floor(this.currentPage))
      : 1;
    this.virtualRowHeight =
      Number.isFinite(this.virtualRowHeight) && this.virtualRowHeight > 0
        ? this.virtualRowHeight
        : 44;
    this.virtualBuffer = Number.isFinite(this.virtualBuffer)
      ? Math.max(0, Math.floor(this.virtualBuffer))
      : 8;
    this.virtualThreshold =
      Number.isFinite(this.virtualThreshold) && this.virtualThreshold >= 1
        ? Math.floor(this.virtualThreshold)
        : 1000;
    // Update table border styles
    if (changedProperties.has('borderStyle')) {
      this.style.setProperty('--border-style', this.borderStyle);
    }

    // Update row line styles
    if (changedProperties.has('rowLines')) {
      const rowLineStyle = this.rowLines ? '1px solid var(--su-border-color)' : 'none';
      this.style.setProperty('--row-line', rowLineStyle);
    }

    // Update column line styles
    if (changedProperties.has('columnLines')) {
      const columnLineStyle = this.columnLines ? '1px solid var(--su-border-color)' : 'none';
      this.style.setProperty('--column-line', columnLineStyle);
    }

    // 表头颜色：传了 CSS 颜色值则覆盖，否则跟随主题默认值
    if (changedProperties.has('theadBgColor')) {
      if (this.theadBgColor) {
        this.style.setProperty('--thead-bg-color', this.theadBgColor);
      } else {
        this.style.removeProperty('--thead-bg-color');
      }
    }

    if (changedProperties.has('theadTextColor')) {
      if (this.theadTextColor) {
        this.style.setProperty('--thead-text-color', this.theadTextColor);
      } else {
        this.style.removeProperty('--thead-text-color');
      }
    }

    // Update sorted columns and data when columns or data change
    if (
      changedProperties.has('columns') ||
      changedProperties.has('data') ||
      changedProperties.has('filters') ||
      changedProperties.has('remote')
    ) {
      for (const row of this.data) {
        if (!this.fallbackRowKeys.has(row))
          this.fallbackRowKeys.set(row, `row-${this.nextFallbackKey++}`);
      }
      const directions = new Map(
        this.sortedColumns.map((column) => [column.key, column.sortDirection])
      );
      this.sortedColumns = this.columns.map((c) => ({ ...c, sortDirection: '' }));
      if (this.remote || changedProperties.has('filters'))
        this.sortedColumns = this.sortedColumns.map((column) => ({
          ...column,
          sortDirection: directions.get(column.key) ?? '',
        }));
      this.sortedData = [...this.filteredData];
      const sort = this.sortedColumns.find((column) => column.sortDirection);
      if (!this.remote && sort)
        this.sortedData.sort(
          (a, b) =>
            this.compareValues(a[sort.key], b[sort.key]) * (sort.sortDirection === 'asc' ? 1 : -1)
        );
      if (!this.remote) this.currentPage = 1;
    }

    if (
      changedProperties.has('pageSize') ||
      changedProperties.has('pagination') ||
      changedProperties.has('infiniteScroll')
    ) {
      // 首次远程加载或显式同步页码时保留业务层传入的当前页。
      if (this.hasUpdated && !changedProperties.has('currentPage')) this.currentPage = 1;
      this.scrollTop = 0;
      this.resetViewportScroll();
    }

    if (changedProperties.has('loadingMore') && !this.loadingMore) {
      this.loadMorePending = false;
    }
    if (this.shouldUsePagination && !this.remote)
      this.currentPage = Math.min(this.currentPage, this.totalPages);
  }

  firstUpdated() {
    this.measureViewportHeight();
  }

  updated() {
    this.measureViewportHeight();
  }

  disconnectedCallback() {
    this.resizeCleanup?.();
    super.disconnectedCallback();
  }

  /** 返回列的当前像素宽度；未拖拽时优先使用列配置。 */
  private getColumnWidth(column: ColumnState) {
    const resized = this.columnWidths[column.key];
    if (resized != null) return `${resized}px`;
    return column.width || 'auto';
  }

  /** 将 CSS 宽度转换为固定列偏移使用的像素值。 */
  private getColumnPixelWidth(column: ColumnState) {
    const resized = this.columnWidths[column.key];
    if (resized != null) return resized;
    const parsed = Number.parseFloat(column.width || '');
    return Number.isFinite(parsed) ? parsed : 120;
  }

  /** 计算固定列相对表格左右边缘的偏移量。 */
  private getFixedOffset(index: number, side: 'left' | 'right') {
    if (side === 'left') {
      const selectionOffset = this.selectable ? 40 : 0;
      return (
        selectionOffset +
        this.sortedColumns
          .slice(0, index)
          .filter((column) => column.fixed === 'left')
          .reduce((sum, column) => sum + this.getColumnPixelWidth(column), 0)
      );
    }
    return this.sortedColumns
      .slice(index + 1)
      .filter((column) => column.fixed === 'right')
      .reduce((sum, column) => sum + this.getColumnPixelWidth(column), 0);
  }

  /** 返回固定列的样式与边界阴影类名。 */
  private getColumnPresentation(column: ColumnState, index: number) {
    const width = this.getColumnWidth(column);
    const widthStyle = width === 'auto' ? 'width: auto;' : `width: ${width}; min-width: ${width};`;
    if (!column.fixed) return { className: '', style: widthStyle };
    const sameSide = this.sortedColumns.filter((item) => item.fixed === column.fixed);
    const edge = column.fixed === 'left' ? sameSide[sameSide.length - 1] : sameSide[0];
    return {
      className: `fixed-column ${edge?.key === column.key ? `fixed-${column.fixed}-edge` : ''}`,
      style: `${widthStyle} ${column.fixed}: ${this.getFixedOffset(index, column.fixed)}px;`,
    };
  }

  /** 开始拖拽列宽，并在结束时发送 column-resize 事件。 */
  private startColumnResize(event: PointerEvent, column: ColumnState) {
    event.preventDefault();
    event.stopPropagation();
    this.resizeCleanup?.();
    const startX = event.clientX;
    const header = (event.currentTarget as HTMLElement).closest('th');
    const startWidth = header?.getBoundingClientRect().width || this.getColumnPixelWidth(column);
    const min = Math.max(40, column.minWidth ?? 64);
    const max = Math.max(min, column.maxWidth ?? Number.POSITIVE_INFINITY);
    let currentWidth = startWidth;
    const move = (moveEvent: PointerEvent) => {
      currentWidth = Math.min(max, Math.max(min, startWidth + moveEvent.clientX - startX));
      this.columnWidths = { ...this.columnWidths, [column.key]: Math.round(currentWidth) };
    };
    const stop = () => {
      this.resizeCleanup?.();
      this.dispatchEvent(
        new CustomEvent('column-resize', {
          detail: { column: column.key, width: Math.round(currentWidth) },
          bubbles: true,
          composed: true,
        })
      );
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', stop, { once: true });
    window.addEventListener('pointercancel', stop, { once: true });
    this.resizeCleanup = () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', stop);
      window.removeEventListener('pointercancel', stop);
      this.resizeCleanup = undefined;
    };
  }

  /** 支持使用方向键以 10px 步长调整列宽。 */
  private handleResizeKeydown(event: KeyboardEvent, column: ColumnState) {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault();
    event.stopPropagation();
    const min = Math.max(40, column.minWidth ?? 64);
    const max = Math.max(min, column.maxWidth ?? Number.POSITIVE_INFINITY);
    const delta = event.key === 'ArrowRight' ? 10 : -10;
    const width = Math.min(max, Math.max(min, this.getColumnPixelWidth(column) + delta));
    this.columnWidths = { ...this.columnWidths, [column.key]: width };
    this.dispatchEvent(
      new CustomEvent('column-resize', {
        detail: { column: column.key, width },
        bubbles: true,
        composed: true,
      })
    );
  }

  private compareValues(a: unknown, b: unknown) {
    if (a == null && b == null) return 0;
    if (a == null) return -1;
    if (b == null) return 1;
    if (typeof a === 'number' && typeof b === 'number') return a - b;
    const av = String(a);
    const bv = String(b);
    return av.localeCompare(bv, 'en', { numeric: true, sensitivity: 'base' });
  }

  private get totalPages() {
    return Math.max(
      1,
      Math.ceil((this.remote ? this.total : this.sortedData.length) / Math.max(1, this.pageSize))
    );
  }

  private get shouldUsePagination() {
    return this.pagination && !this.infiniteScroll;
  }

  private get paginatedData() {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    return this.sortedData.slice(start, end);
  }

  private get sourceData() {
    return this.shouldUsePagination && !this.remote ? this.paginatedData : this.sortedData;
  }

  private get shouldUseVirtualScroll() {
    if (this.spanMethod || this.expandable) return false;
    return this.virtualScroll || this.sourceData.length >= this.virtualThreshold;
  }

  private get effectiveHeight() {
    return this.height || '420px';
  }

  private get totalColumnCount() {
    return Math.max(
      1,
      this.sortedColumns.length + (this.selectable ? 1 : 0) + (this.expandable ? 1 : 0)
    );
  }

  /** 展开状态以稳定 rowKey 保存，分页或排序后仍对应同一条记录。 */
  private toggleRowExpansion(row: TableRow, rowIndex: number) {
    const key = this.getRowKey(row, rowIndex);
    const expanded = !this.expandedKeys.includes(key);
    this.expandedKeys = expanded
      ? [...this.expandedKeys, key]
      : this.expandedKeys.filter((item) => item !== key);
    this.dispatchEvent(
      new CustomEvent('expand-change', {
        detail: { key, row, expanded, keys: [...this.expandedKeys] },
        bubbles: true,
        composed: true,
      })
    );
  }

  private isRowSelected(row: TableRow, rowIndex: number) {
    return this.selectedKeys.includes(this.getRowKey(row, rowIndex));
  }

  private emitSelectionChange(keys: string[]) {
    this.selectedKeys = keys;
    const keySet = new Set(keys);
    const rows = this.sortedData.filter((row, index) => keySet.has(this.getRowKey(row, index)));
    this.dispatchEvent(
      new CustomEvent('selection-change', {
        detail: { keys, rows },
        bubbles: true,
        composed: true,
      })
    );
  }

  private toggleRowSelection(row: TableRow, rowIndex: number) {
    const key = this.getRowKey(row, rowIndex);
    const keys = this.selectedKeys.includes(key)
      ? this.selectedKeys.filter((k) => k !== key)
      : [...this.selectedKeys, key];
    this.emitSelectionChange(keys);
  }

  /** 全选/取消全选当前可见数据（当前页或已加载数据） */
  private toggleAllSelection() {
    const visibleKeys = this.sourceData.map((row, index) => this.getRowKey(row, index));
    const allSelected =
      visibleKeys.length > 0 && visibleKeys.every((key) => this.selectedKeys.includes(key));
    const keys = allSelected
      ? this.selectedKeys.filter((key) => !visibleKeys.includes(key))
      : [...new Set([...this.selectedKeys, ...visibleKeys])];
    this.emitSelectionChange(keys);
  }

  private get virtualState() {
    const rows = this.sourceData;
    if (!this.shouldUseVirtualScroll) {
      return {
        start: 0,
        rows,
        topPadding: 0,
        bottomPadding: 0,
      };
    }
    const viewportHeight = this.viewportHeight || 420;
    const visible = Math.ceil(viewportHeight / this.virtualRowHeight) + this.virtualBuffer * 2;
    const start = Math.min(
      Math.max(0, rows.length - visible),
      Math.max(0, Math.floor(this.scrollTop / this.virtualRowHeight) - this.virtualBuffer)
    );
    const end = Math.min(rows.length, start + visible);
    return {
      start,
      rows: rows.slice(start, end),
      topPadding: start * this.virtualRowHeight,
      bottomPadding: (rows.length - end) * this.virtualRowHeight,
    };
  }

  private measureViewportHeight() {
    const el = this.getViewportElement();
    if (!el) return;
    if (this.viewportHeight !== el.clientHeight && el.clientHeight > 0) {
      this.viewportHeight = el.clientHeight;
    }
  }

  private getViewportElement() {
    return this.renderRoot?.querySelector('.table-viewport') as HTMLDivElement | null;
  }

  private resetViewportScroll() {
    const el = this.getViewportElement();
    if (el) {
      el.scrollTop = 0;
    }
  }

  private getRowKey(row: TableRow, rowIndex: number) {
    const explicitKey = row[this.rowKey];
    if (explicitKey != null && explicitKey !== '') return String(explicitKey);
    return this.fallbackRowKeys.get(row) ?? `row-${rowIndex}`;
  }

  private getCellDisplayValue(row: TableRow, column: Column, rowIndex: number) {
    const raw = row[column.key];
    if (column.formatter) {
      return column.formatter(raw, row, rowIndex);
    }
    return raw ?? '';
  }

  private normalizeSpan(result: SpanResult): CellSpan {
    if (!result) return { rowspan: 1, colspan: 1 };
    if (Array.isArray(result)) {
      const rowspan = Math.max(0, Math.floor(result[0] ?? 1));
      const colspan = Math.max(0, Math.floor(result[1] ?? 1));
      return { rowspan, colspan };
    }
    const rowspan = Math.max(0, Math.floor(result.rowspan ?? 1));
    const colspan = Math.max(0, Math.floor(result.colspan ?? 1));
    return { rowspan, colspan };
  }

  private getCellSpan(args: SpanMethodArgs): CellSpan {
    if (!this.spanMethod) return { rowspan: 1, colspan: 1 };
    return this.normalizeSpan(this.spanMethod(args));
  }

  private setCurrentPage(nextPage: number) {
    const bounded = Math.min(
      this.totalPages,
      Math.max(1, Number.isFinite(nextPage) ? nextPage : 1)
    );
    this.currentPage = bounded;
    this.scrollTop = 0;
    this.resetViewportScroll();
    this.dispatchEvent(
      new CustomEvent('page-change', {
        detail: { currentPage: bounded },
        bubbles: true,
        composed: true,
      })
    );
  }

  private handlePaginationChange(event: Event) {
    // 内部分页器的事件由表格转发一次，避免外部重复发起请求。
    event.stopPropagation();
    const customEvent = event as CustomEvent<{ currentPage: number }>;
    this.setCurrentPage(customEvent.detail?.currentPage ?? 1);
  }

  private maybeEmitLoadMore(target: HTMLDivElement) {
    if (!this.infiniteScroll || !this.hasMore || this.loadingMore || this.loadMorePending) return;
    const distance = target.scrollHeight - target.scrollTop - target.clientHeight;
    if (distance > this.loadMoreOffset) return;
    this.loadMorePending = true;
    this.dispatchEvent(
      new CustomEvent('load-more', {
        detail: {
          loadedCount: this.sortedData.length,
        },
        bubbles: true,
        composed: true,
      })
    );
  }

  private handleBodyScroll(event: Event) {
    const target = event.target as HTMLDivElement;
    this.scrollTop = target.scrollTop;
    if (target.clientHeight !== this.viewportHeight && target.clientHeight > 0) {
      this.viewportHeight = target.clientHeight;
    }
    this.maybeEmitLoadMore(target);
  }

  private handleRowClick(row: TableRow, rowIndex: number) {
    this.dispatchEvent(
      new CustomEvent('row-click', {
        detail: {
          row,
          rowIndex,
        },
        bubbles: true,
        composed: true,
      })
    );
  }

  private renderRows() {
    const virtual = this.virtualState;
    const hasData = virtual.rows.length > 0;
    if (!hasData) {
      return html`
        <tr>
          <td colspan="${this.totalColumnCount}" class="empty">${this.noDataText}</td>
        </tr>
      `;
    }

    const topSpacer =
      virtual.topPadding > 0
        ? html`
            <tr class="virtual-spacer" aria-hidden="true">
              <td colspan="${this.totalColumnCount}" style="height: ${virtual.topPadding}px;"></td>
            </tr>
          `
        : nothing;

    const bottomSpacer =
      virtual.bottomPadding > 0
        ? html`
            <tr class="virtual-spacer" aria-hidden="true">
              <td
                colspan="${this.totalColumnCount}"
                style="height: ${virtual.bottomPadding}px;"
              ></td>
            </tr>
          `
        : nothing;

    const sourceOffset = this.shouldUsePagination ? (this.currentPage - 1) * this.pageSize : 0;
    const coveredCells = new Set<string>();
    const rows = repeat(
      virtual.rows,
      (row, localIndex) => this.getRowKey(row, virtual.start + localIndex),
      (row, localIndex) => {
        const rowIndex = virtual.start + localIndex;
        const globalRowIndex = sourceOffset + rowIndex;
        const expanded =
          this.expandable && this.expandedKeys.includes(this.getRowKey(row, rowIndex));
        const canExpand = this.rowExpandable?.(row, globalRowIndex) ?? true;
        return html`
          <tr
            class="${this.striped ? 'striped' : ''} ${this.hoverable ? 'hoverable' : ''}"
            @click="${() => this.handleRowClick(row, rowIndex)}"
          >
            ${this.selectable
              ? html`
                  <td
                    class="selection-cell ${this.sortedColumns.some(
                      (column) => column.fixed === 'left'
                    )
                      ? 'fixed-column'
                      : ''}"
                    style="${this.sortedColumns.some((column) => column.fixed === 'left')
                      ? 'left: 0;'
                      : ''}"
                    @click="${(e: Event) => e.stopPropagation()}"
                  >
                    <input
                      type="checkbox"
                      .checked="${this.isRowSelected(row, rowIndex)}"
                      @change="${() => this.toggleRowSelection(row, rowIndex)}"
                    />
                  </td>
                `
              : nothing}
            ${this.expandable
              ? html`<td class="expansion-cell">
                  <button
                    type="button"
                    aria-label="${expanded ? '收起行' : '展开行'}"
                    aria-expanded="${expanded}"
                    ?disabled="${!canExpand}"
                    @click="${(event: Event) => {
                      event.stopPropagation();
                      this.toggleRowExpansion(row, rowIndex);
                    }}"
                  >
                    ${expanded ? '−' : '+'}
                  </button>
                </td>`
              : nothing}
            ${this.sortedColumns.map((col, columnIndex) => {
              const cellKey = `${rowIndex}-${columnIndex}`;
              if (coveredCells.has(cellKey)) return nothing;
              const span = this.getCellSpan({
                row,
                rowIndex: globalRowIndex,
                column: col,
                columnIndex,
                data: this.sourceData,
                columns: this.sortedColumns,
              });
              if (span.rowspan <= 0 || span.colspan <= 0) return nothing;
              for (let r = 0; r < span.rowspan; r += 1) {
                for (let c = 0; c < span.colspan; c += 1) {
                  if (r === 0 && c === 0) continue;
                  coveredCells.add(`${rowIndex + r}-${columnIndex + c}`);
                }
              }
              const align = col.align ?? 'center';
              const value = this.getCellDisplayValue(row, col, rowIndex);
              const presentation = this.getColumnPresentation(col, columnIndex);
              return html`
                <td
                  class="${col.ellipsis ? 'ellipsis' : ''} ${presentation.className}"
                  rowspan="${span.rowspan}"
                  colspan="${span.colspan}"
                  style="text-align: ${align}; max-width: ${this.getColumnWidth(
                    col
                  )}; ${presentation.style}"
                >
                  ${value}
                </td>
              `;
            })}
          </tr>
          ${expanded && canExpand
            ? html`<tr class="expanded-row">
                <td colspan="${this.totalColumnCount}">
                  ${this.expandedRowRender?.(row, globalRowIndex) ?? nothing}
                </td>
              </tr>`
            : nothing}
        `;
      }
    );

    return html`${topSpacer}${rows}${bottomSpacer}`;
  }

  private renderPagination() {
    if (!this.shouldUsePagination) return nothing;
    return html`
      <se-pagination
        class="pagination"
        .currentPage="${this.currentPage}"
        .total="${this.remote ? this.total : this.sortedData.length}"
        .pageSize="${this.pageSize}"
        @page-change="${this.handlePaginationChange}"
      ></se-pagination>
    `;
  }

  private renderLoadMoreStatus() {
    if (!this.infiniteScroll) return nothing;
    if (this.loadingMore) return html`<div class="status-line">${this.loadingText}</div>`;
    if (!this.hasMore) return html`<div class="status-line">${this.noMoreText}</div>`;
    return html`<div class="status-line">${this.loadMoreText}</div>`;
  }

  private renderSelectionHeader() {
    if (!this.selectable) return nothing;
    const visibleKeys = this.sourceData.map((row, index) => this.getRowKey(row, index));
    const selectedVisible = visibleKeys.filter((key) => this.selectedKeys.includes(key));
    const allSelected = visibleKeys.length > 0 && selectedVisible.length === visibleKeys.length;
    const indeterminate = selectedVisible.length > 0 && !allSelected;
    return html`
      <th
        class="selection-cell ${this.sortedColumns.some((column) => column.fixed === 'left')
          ? 'fixed-column'
          : ''}"
        style="${this.sortedColumns.some((column) => column.fixed === 'left') ? 'left: 0;' : ''}"
      >
        <input
          type="checkbox"
          aria-label="全选"
          .checked="${allSelected}"
          .indeterminate="${indeterminate}"
          @change="${() => this.toggleAllSelection()}"
        />
      </th>
    `;
  }

  render() {
    const scrollable = this.infiniteScroll || this.shouldUseVirtualScroll;
    return html`
      <div class="table-wrapper">
        <div
          class="table-viewport ${scrollable ? 'scrollable' : ''}"
          style="${scrollable ? `height: ${this.effectiveHeight};` : ''}"
          @scroll="${this.handleBodyScroll}"
        >
          <table>
            <thead class="${this.stickyHeader && scrollable ? 'sticky' : ''}">
              <tr>
                ${this.renderSelectionHeader()}
                ${this.expandable
                  ? html`<th class="expansion-cell" aria-label="行展开"></th>`
                  : nothing}
                ${this.sortedColumns.map((col, index) => {
                  const presentation = this.getColumnPresentation(col, index);
                  return html`
                    <th
                      class="column-header ${col.sortable
                        ? 'sortable'
                        : ''} ${presentation.className}"
                      style="${presentation.style} text-align: ${col.align || 'center'};"
                      scope="col"
                      aria-sort="${col.sortable
                        ? col.sortDirection === 'asc'
                          ? 'ascending'
                          : col.sortDirection === 'desc'
                            ? 'descending'
                            : 'none'
                        : nothing}"
                      @click="${() => this.sortColumn(index)}"
                    >
                      ${col.sortable
                        ? html`<button
                            type="button"
                            class="sort-button"
                            @click="${(event: Event) => {
                              event.stopPropagation();
                              this.sortColumn(index);
                            }}"
                          >
                            ${col.label}<span class="sort-indicator" aria-hidden="true"
                              >${col.sortDirection === 'asc'
                                ? '↑'
                                : col.sortDirection === 'desc'
                                  ? '↓'
                                  : '⇅'}</span
                            >
                          </button>`
                        : col.label}
                      ${col.filterable
                        ? html`<input
                            type="search"
                            class="column-filter"
                            aria-label=${`筛选${col.label}`}
                            .value=${this.filterValue(col.key)}
                            placeholder="筛选"
                            @click=${(event: Event) => event.stopPropagation()}
                            @input=${(event: Event) =>
                              this.changeFilter(col.key, (event.target as HTMLInputElement).value)}
                          />`
                        : nothing}
                      ${col.resizable
                        ? html`<span
                            class="resize-handle"
                            role="separator"
                            aria-label="调整${col.label}列宽"
                            aria-orientation="vertical"
                            tabindex="0"
                            @click="${(event: Event) => event.stopPropagation()}"
                            @pointerdown="${(event: PointerEvent) =>
                              this.startColumnResize(event, col)}"
                            @keydown="${(event: KeyboardEvent) =>
                              this.handleResizeKeydown(event, col)}"
                          ></span>`
                        : nothing}
                    </th>
                  `;
                })}
              </tr>
            </thead>
            <tbody>
              ${this.renderRows()}
            </tbody>
          </table>
        </div>
        ${this.loading
          ? html`<div class="loading-overlay"><span class="loading-spinner"></span></div>`
          : nothing}
        ${this.renderLoadMoreStatus()} ${this.renderPagination()}
      </div>
    `;
  }
}
