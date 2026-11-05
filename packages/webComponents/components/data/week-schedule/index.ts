import { LitElement, css, html, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { isValidDateValue, localToday, shiftCalendarDate } from '../../_shared/date';
import { baseControlStyles, focusRingStyles } from '../../_shared/styles';

export interface WeekScheduleItem {
  id: string;
  date: string;
  title: string;
  time?: string;
}

const weekdays = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];

@customElement('su-week-schedule')
export class SuWeekSchedule extends LitElement {
  @property({ type: String }) date = '';
  @property({ attribute: false }) items: readonly WeekScheduleItem[] = [];

  static styles = [
    baseControlStyles,
    focusRingStyles,
    css`
      :host {
        display: block;
        min-width: 0;
        container-type: inline-size;
      }
      header {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 8px;
        margin-bottom: 10px;
      }
      header strong {
        margin-inline-end: auto;
        font-variant-numeric: tabular-nums;
      }
      button {
        font: inherit;
        color: inherit;
        border: 1px solid var(--su-border-color);
        border-radius: var(--su-radius-sm);
        background: var(--su-bg-card);
        padding: 5px 8px;
        cursor: pointer;
      }
      button:disabled {
        opacity: 0.5;
        cursor: default;
      }
      .week {
        display: grid;
        gap: 8px;
      }
      .day {
        min-width: 0;
        border-block-start: 2px solid var(--su-border-color);
        padding: 6px 4px;
      }
      .day[aria-current='date'] {
        border-color: var(--su-color-primary);
      }
      .day-heading {
        margin: 0 0 6px;
        font: inherit;
        font-weight: 600;
      }
      time,
      .empty {
        color: var(--su-text-2);
        font-size: var(--su-font-size-sm);
      }
      ul {
        list-style: none;
        padding: 0;
        margin: 0;
        display: grid;
        gap: 4px;
      }
      .entry {
        width: 100%;
        display: grid;
        gap: 3px;
        text-align: start;
        overflow-wrap: anywhere;
      }
      .entry:hover {
        border-color: var(--su-color-primary);
      }
      @container (min-width: 650px) {
        .week {
          grid-template-columns: repeat(7, minmax(0, 1fr));
        }
        .day {
          min-height: 112px;
        }
      }
    `,
  ];

  private get start() {
    const date = isValidDateValue(this.date) ? this.date : localToday();
    const weekday = new Date(`${date}T00:00:00Z`).getUTCDay();
    return shiftCalendarDate(date, -((weekday + 6) % 7));
  }

  private moveWeek(start: string) {
    if (!isValidDateValue(start) || start === this.start) return;
    this.date = start;
    this.dispatchEvent(
      new CustomEvent('week-change', {
        detail: { start },
        bubbles: true,
        composed: true,
      })
    );
  }

  private select(item: WeekScheduleItem) {
    if (!this.items.includes(item)) return;
    this.dispatchEvent(
      new CustomEvent('item-select', {
        detail: { item },
        bubbles: true,
        composed: true,
      })
    );
  }

  render() {
    const start = this.start;
    const previous = shiftCalendarDate(start, -7);
    const next = shiftCalendarDate(start, 7);
    const dates = weekdays
      .map((_, index) => shiftCalendarDate(start, index))
      .filter(isValidDateValue);
    const current = localToday();
    const byDate = new Map(dates.map((date) => [date, [] as WeekScheduleItem[]]));
    for (const item of this.items) byDate.get(item.date)?.push(item);
    return html`
      <header>
        <strong aria-live="polite">${start} 至 ${dates[dates.length - 1]}</strong>
        <button
          type="button"
          ?disabled=${!isValidDateValue(previous)}
          @click=${() => this.moveWeek(previous)}
        >
          上一周
        </button>
        <button
          type="button"
          ?disabled=${!isValidDateValue(next)}
          @click=${() => this.moveWeek(next)}
        >
          下一周
        </button>
      </header>
      <div class="week" part="week">
        ${dates.map((date, index) => {
          const entries = byDate.get(date)!;
          return html`<section
            class="day"
            part="day"
            aria-label=${`${date} ${weekdays[index]}`}
            aria-current=${date === current ? 'date' : nothing}
          >
            <h3 class="day-heading">
              ${weekdays[index]} <time datetime=${date}>${date.slice(5)}</time>
            </h3>
            ${entries.length
              ? html`<ul>
                  ${entries.map(
                    (item) =>
                      html`<li>
                        <button
                          type="button"
                          class="entry"
                          part="entry"
                          @click=${() => this.select(item)}
                        >
                          ${item.title} ${item.time ? html`<small>${item.time}</small>` : nothing}
                        </button>
                      </li>`
                  )}
                </ul>`
              : html`<span class="empty">暂无排班</span>`}
          </section>`;
        })}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'su-week-schedule': SuWeekSchedule;
  }
}
