import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
// import 'uno.css'; // 引入 UnoCSS

interface Column {
  key: string;
  label: string;
  sortable?: boolean;
  filterable?: boolean;
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
  static styles = css`
  import 'uno.css'
   @unocss-placeholder
`

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
  }

  render() {
    return html`
      <table class="w-full border-collapse border-spacing-0">
        <thead>
          <tr>
            ${this.columns.map(
      (col) => html`
                <th
                  class="${this.theadBgColor} ${this.theadTextColor} font-bold p-2 border-b-2 border-gray-300 ${col.sortable ? 'cursor-pointer' : ''}">
                  ${col.label}
                </th>
              `
    )}
          </tr>
        </thead>
        <tbody>
          ${this.data.length === 0
        ? html`
                <tr>
                  <td
                    colspan="${this.columns.length}"
                    class="text-center p-2 border border-gray-300">
                    ${this.noDataText}
                  </td>
                </tr>
              `
        : this.data.map(
          (row) => html`
                  <tr>
                    ${this.columns.map(
            (col) => html`
                        <td class="p-2 border border-gray-300">${row[col.key]}</td>
                      `
          )}
                  </tr>
                `
        )}
        </tbody>
      </table>
    `;
  }
}
