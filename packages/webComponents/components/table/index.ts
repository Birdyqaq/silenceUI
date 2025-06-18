import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
// import 'uno.css'; // 引入 UnoCSS

interface Column {
  key: string;
  label: string;
  sortable?: boolean;
  filterable?: boolean;
  width?: string;
}

@customElement('se-table')
export class seTable extends LitElement {
  @property({ type: Array })
  data: any[] = [];

  @property({ type: Array })
  columns: Column[] = [];

  @property({ type: String })
  noDataText: string = 'No data available';

  @property({ type: String })
  borderStyle: string = '1px solid none';

  @property({ type: Boolean })
  rowLines: boolean = true;

  @property({ type: Boolean })
  columnLines: boolean = true;

  @property({ type: String })
  theadBgColor: string = 'bg-gray-200'; // UnoCSS 类名

  @property({ type: String })
  theadTextColor: string = 'text-gray-800'; // UnoCSS 类名

  @property({ type: Number })
  pageSize: number = 10;

  @state()
  currentPage: number = 1;

  @state()
  sortedColumns: Column[] = [];

  @state()
  sortedData: any[] = [];

  sortColumn: (index: number) => void;

  static styles = css`
    import 'uno.css';
    @unocss-placeholder;
  `;

  constructor() {
    super();
    this.sortedColumns = [...this.columns];
    this.sortedData = [...this.data];
    this.sortColumn = (index: number) => {
      const col = this.sortedColumns[index];
      if (col.sortable) {
        this.sortedData.sort((a, b) => {
          if (a[col.key] < b[col.key]) return -1;
          if (a[col.key] > b[col.key]) return 1;
          return 0;
        });
        this.sortedColumns = [...this.sortedColumns];
        this.sortedData = [...this.sortedData];
      }
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
      this.sortedColumns = [...this.columns];
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
                    class="${this.theadBgColor} ${this.theadTextColor} font-bold p-2 border-b-2 border-gray-300 ${col.sortable ? 'cursor-pointer' : ''}"
                    style="width: ${col.width || 'auto'}"
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
                    <tr>
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