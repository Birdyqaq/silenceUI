import { LitElement, css, html, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { isValidDateValue, localToday, shiftCalendarDate } from '../../_shared/date';
import { baseControlStyles, focusRingStyles } from '../../_shared/styles';

const weekdays = ['一', '二', '三', '四', '五', '六', '日'];
const earliest = '0001-01';
const latest = '9999-12';

@customElement('su-calendar')
export class SuCalendar extends LitElement {
  @property({ type: String }) value = '';
  @property({ type: String }) month = '';
  @state() private focusedDate = '';

  static styles = [
    baseControlStyles,
    focusRingStyles,
    css`
      :host {
        display: block;
        min-width: 0;
      }
      header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        margin-bottom: 12px;
      }
      table {
        width: 100%;
        table-layout: fixed;
        border-collapse: collapse;
      }
      th {
        padding: 6px 0;
        color: var(--su-text-2);
        font-weight: 500;
      }
      td {
        height: 56px;
        padding: 3px;
        vertical-align: top;
        border: 1px solid var(--su-border-color);
        overflow-wrap: anywhere;
      }
      button {
        font: inherit;
        color: inherit;
        background: var(--su-bg-card);
        border: 1px solid var(--su-border-color);
        border-radius: var(--su-radius-sm);
        cursor: pointer;
        padding: 4px 8px;
      }
      button:disabled {
        opacity: 0.45;
        cursor: default;
      }
      td button {
        width: 100%;
        padding: 4px 0;
        border-color: transparent;
      }
      button[aria-pressed='true'] {
        border-color: var(--su-color-primary);
        background: var(--su-bg-hover);
      }
      button[aria-current='date'] {
        font-weight: 700;
        color: var(--su-color-primary);
      }
    `,
  ];

  private get visibleMonth() {
    if (/^\d{4}-\d{2}$/.test(this.month) && isValidDateValue(`${this.month}-01`)) return this.month;
    return (isValidDateValue(this.value) ? this.value : localToday()).slice(0, 7);
  }

  private moveMonth(month: string) {
    if (month === this.visibleMonth) return;
    this.month = month;
    this.dispatchEvent(
      new CustomEvent('month-change', {
        detail: { month },
        bubbles: true,
        composed: true,
      })
    );
  }

  private select(date: string) {
    if (date === this.value) return;
    this.value = date;
    this.dispatchEvent(
      new CustomEvent('change', {
        detail: { value: date },
        bubbles: true,
        composed: true,
      })
    );
  }

  private navigate(event: KeyboardEvent, date: string) {
    const offsets: Record<string, number> = {
      ArrowLeft: -1,
      ArrowRight: 1,
      ArrowUp: -7,
      ArrowDown: 7,
    };
    const offset = offsets[event.key];
    if (typeof offset !== 'number') return;
    event.preventDefault();
    const next = shiftCalendarDate(date, offset);
    if (!isValidDateValue(next)) return;
    const previousFocus = this.shadowRoot?.activeElement;
    this.focusedDate = next;
    this.moveMonth(next.slice(0, 7));
    void this.updateComplete.then(() => {
      if (
        this.isConnected &&
        ((previousFocus && this.shadowRoot?.activeElement === previousFocus) ||
          this.ownerDocument.activeElement === this.ownerDocument.body)
      ) {
        this.renderRoot.querySelector<HTMLButtonElement>(`[data-date="${next}"]`)?.focus();
      }
    });
  }

  render() {
    const month = this.visibleMonth;
    const first = `${month}-01`;
    const weekday = new Date(`${first}T00:00:00Z`).getUTCDay();
    const offset = (weekday + 6) % 7;
    const current = localToday();
    const tabDate =
      [this.focusedDate, this.value, current].find(
        (date) => isValidDateValue(date) && date.startsWith(`${month}-`)
      ) ?? first;
    const title = `${month.slice(0, 4)} 年 ${Number(month.slice(5))} 月`;
    return html`
      <header>
        <button
          type="button"
          aria-label="上个月"
          ?disabled=${month === earliest}
          @click=${() => this.moveMonth(shiftCalendarDate(first, 0, -1).slice(0, 7))}
        >
          ‹
        </button>
        <strong aria-live="polite">${title}</strong>
        <button
          type="button"
          aria-label="下个月"
          ?disabled=${month === latest}
          @click=${() => this.moveMonth(shiftCalendarDate(first, 0, 1).slice(0, 7))}
        >
          ›
        </button>
      </header>
      <table aria-label=${title}>
        <thead>
          <tr>
            ${weekdays.map((day) => html`<th scope="col">周${day}</th>`)}
          </tr>
        </thead>
        <tbody>
          ${Array.from(
            { length: 6 },
            (_, week) =>
              html`<tr>
                ${Array.from({ length: 7 }, (_, day) => {
                  const date = shiftCalendarDate(first, week * 7 + day - offset);
                  if (!date.startsWith(`${month}-`)) return html`<td></td>`;
                  return html`<td part="day">
                    <button
                      type="button"
                      part="date-button"
                      data-date=${date}
                      aria-label=${date}
                      aria-pressed=${String(date === this.value)}
                      aria-current=${date === current ? 'date' : nothing}
                      tabindex=${date === tabDate ? 0 : -1}
                      @focus=${() => {
                        this.focusedDate = date;
                      }}
                      @keydown=${(event: KeyboardEvent) => this.navigate(event, date)}
                      @click=${() => this.select(date)}
                    >
                      ${Number(date.slice(8))}
                    </button>
                    <slot name=${`day-${date}`}></slot>
                  </td>`;
                })}
              </tr>`
          )}
        </tbody>
      </table>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'su-calendar': SuCalendar;
  }
}
