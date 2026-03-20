import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { tableStyles } from './seTable';

interface Column {
  key: string;
  label: string;
  sortable?: boolean;
  filterable?: boolean;
  width?: string;
}

type SortDirection = 'asc' | 'desc' | '';
type ColumnState = Column & { sortDirection?: SortDirection };

@customElement('se-table')
export class seTable extends LitElement {
  @property({ type: Array })
    
  //数据源 data starts here
  data: any[] = [];
  
  //列 definitions columns starts here
  @property({ type: Array })
  columns: Column[] = [];
  
  //没有文件展示 no data text starts here
  @property({ type: String })
  noDataText: string = 'No data available';

  //表格边框样式 table border style starts here
  @property({ type: String })
  borderStyle: string = '1px solid #ddd';
  
  // 行线 row lines starts here
  @property({ type: Boolean })
  rowLines: boolean = true;
  
  // 列线 column lines starts here
  @property({ type: Boolean })
  columnLines: boolean = true;

  // 表头背景色 table header background color starts here
  @property({ type: String })
  theadBgColor: string = 'bg-gray-200'; // UnoCSS 类名

  // 表头文字颜色 table header text color starts here
  @property({ type: String })
  theadTextColor: string = 'text-gray-800'; // UnoCSS 类名

  // 每页显示数量 page size starts here
  @property({ type: Number })
  pageSize: number = 10;

  // 斑马纹
  @property({ type: Boolean })
  striped: boolean = false;

  // 悬停高亮
  @property({ type: Boolean })
  hoverable: boolean = false;

  // 当前页 current page starts here
  @state()
  currentPage: number = 1;

  // 排序的列 sorted columns starts here
  @state()
  sortedColumns: ColumnState[] = [];

  // 排序后的数据 sorted data starts here
  @state()
  sortedData: any[] = [];

  // 排序函数 sort function starts here
  sortColumn: (index: number) => void;

  static styles = [
    tableStyles,
    css`
      .pagination {
        margin-top: 12px;
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 14px;
      }

      input[type='number'] {
        width: 64px;
        padding: 6px 8px;
        border: 1px solid #d1d5db;
        border-radius: 6px;
        font-size: 14px;
      }

      thead th {
        cursor: default;
        user-select: none;
      }

      thead th.sortable::after {
        content: attr(data-sort);
        margin-left: 6px;
        font-size: 12px;
        color: #9ca3af;
      }

      tbody tr.striped:nth-child(even) {
        background-color: #f9fafb;
      }

      tbody tr.hoverable:hover {
        background-color: #f1f5f9;
      }
    `
  ];

  constructor() {
    super();
    this.sortedColumns = [...this.columns];
    this.sortedData = [...this.data];
    this.sortColumn = (index: number) => {
      const col = this.sortedColumns[index];
      if (!col.sortable) return;

      const nextDirection: SortDirection =
        col.sortDirection === 'asc' ? 'desc' : col.sortDirection === 'desc' ? '' : 'asc';

      // reset directions
      this.sortedColumns = this.sortedColumns.map((c, i) => ({
        ...c,
        sortDirection: i === index ? nextDirection : ''
      }));

      if (nextDirection === '') {
        this.sortedData = [...this.data];
      } else {
        this.sortedData = [...this.data].sort((a, b) => {
          const valA = a[col.key];
          const valB = b[col.key];
          if (valA === valB) return 0;
          const result = valA > valB ? 1 : -1;
          return nextDirection === 'asc' ? result : -result;
        });
      }

      this.dispatchEvent(
        new CustomEvent('sort-change', {
          detail: { column: col.key, direction: nextDirection }
        })
      );
    };
  }

  willUpdate(changedProperties: Map<string | number | symbol, unknown>) {
    // Update table border styles
    if (changedProperties.has('borderStyle')) {
      this.style.setProperty('--border-style', this.borderStyle);
    }

    // Update row line styles
    if (changedProperties.has('rowLines')) {
      const rowLineStyle = this.rowLines ? '1px solid #ddd' : 'none';
      this.style.setProperty('--row-line', rowLineStyle);
    }

    // Update column line styles
    if (changedProperties.has('columnLines')) {
      const columnLineStyle = this.columnLines ? '1px solid #ddd' : 'none';
      this.style.setProperty('--column-line', columnLineStyle);
    }

    // Update table header background color (UnoCSS)
    if (changedProperties.has('theadBgColor')) {
      this.style.setProperty('--thead-bg-color', this.theadBgColor);
    }

    // Update table header text color (UnoCSS)
    if (changedProperties.has('theadTextColor')) {
      this.style.setProperty('--thead-text-color', this.theadTextColor);
    }

    // Update sorted columns and data when columns or data change
    if (changedProperties.has('columns') || changedProperties.has('data')) {
      this.sortedColumns = this.columns.map((c) => ({ ...c, sortDirection: '' }));
      this.sortedData = [...this.data];
    }
  }

  get paginatedData() {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    return this.sortedData.slice(start, end);
  }

  handlePageChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this.currentPage = Number(target.value);
  }

  render() {
    return html`
      <div>
        <table class="w-full border-collapse border-spacing-0">
          <thead>
            <tr>
              ${this.sortedColumns.map(
      (col, index) => html`
                  <th
                    class="${this.theadBgColor} ${this.theadTextColor} font-bold p-2 border-b-2 border-gray-300 ${col.sortable ? 'cursor-pointer sortable' : ''}"
                    style="width: ${col.width || 'auto'}"
                    data-sort="${col.sortDirection === 'asc' ? '↑' : col.sortDirection === 'desc' ? '↓' : '⇅'}"
                    @click="${() => this.sortColumn(index)}">
                    ${col.label}
                  </th>
                `
    )}
            </tr>
          </thead>
          <tbody>
            ${this.paginatedData.length === 0
        ? html`
                  <tr>
                    <td
                      colspan="${this.columns.length}"
                      class="text-center p-2 border border-gray-300">
                      ${this.noDataText}
                    </td>
                  </tr>
                `
        : this.paginatedData.map(
          (row) => html`
                    <tr class="${this.striped ? 'striped' : ''} ${this.hoverable ? 'hoverable' : ''}">
                      ${this.sortedColumns.map(
            (col) => html`
                          <td class="p-2 border text-center border-gray-300">${row[col.key]}</td>
                        `
          )}
                    </tr>
                  `
        )}
          </tbody>
        </table>
        <div class="pagination">
          <label for="page">Page:</label>
          <input
            type="number"
            id="page"
            name="page"
            min="1"
            .value="${this.currentPage}"
            @input="${this.handlePageChange}" />
          of ${Math.ceil(this.sortedData.length / this.pageSize)}
        </div>
      </div>
    `;
  }
}
