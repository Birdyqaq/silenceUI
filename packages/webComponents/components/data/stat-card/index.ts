import { LitElement, css, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { baseControlStyles } from '../../_shared/styles';

@customElement('su-stat-card')
export class SuStatCard extends LitElement {
  @property({ type: String }) title = '';
  @property({ type: String }) value = '';
  @property({ type: String }) trend = '';
  @property({ type: String }) trendType: 'up' | 'down' | 'flat' = 'flat';

  @state() private hasTrendSlot = false;

  private onTrendSlotChange(event: Event) {
    this.hasTrendSlot = (event.target as HTMLSlotElement)
      .assignedNodes({ flatten: true })
      .some((node) => node.nodeType === Node.ELEMENT_NODE || Boolean(node.textContent?.trim()));
  }

  static styles = [
    baseControlStyles,
    css`
      :host {
        display: block;
        min-width: 0;
      }

      .card {
        border: 1px solid var(--su-border-color);
        border-radius: var(--su-radius-md);
        background: var(--su-bg-card);
        box-shadow: var(--su-shadow-sm);
        padding: 14px;
      }

      .title {
        color: var(--su-text-3);
        font-size: var(--su-font-size-sm);
        margin-bottom: 8px;
        overflow-wrap: anywhere;
      }

      .value {
        color: var(--su-text-1);
        font-size: 26px;
        line-height: 1.2;
        font-weight: 700;
        overflow-wrap: anywhere;
        display: flex;
        flex-wrap: wrap;
        align-items: baseline;
        gap: 4px;
      }

      .number {
        min-width: 0;
        overflow-wrap: anywhere;
        font-variant-numeric: tabular-nums;
      }

      .value ::slotted(*) {
        font-size: 0.75em;
        font-weight: 500;
      }

      .trend {
        overflow-wrap: anywhere;
        margin-top: 8px;
        font-size: var(--su-font-size-sm);
      }

      .trend.up {
        color: var(--su-color-success);
      }

      .trend.down {
        color: var(--su-color-error);
      }

      .trend.flat {
        color: var(--su-text-3);
      }

      .trend[hidden] {
        display: none;
      }
    `
  ];

  render() {
    const trendType = ['up', 'down', 'flat'].includes(this.trendType) ? this.trendType : 'flat';
    const trendIcon = trendType === 'up' ? '↑' : trendType === 'down' ? '↓' : '→';
    return html`
      <article class="card" part="card">
        <div class="title" part="title"><slot name="title">${this.title}</slot></div>
        <div class="value" part="value"><slot name="prefix"></slot><span class="number">${this.value}</span><slot name="suffix"></slot></div>
        <div class="trend ${trendType}" part="trend" ?hidden=${!this.trend && !this.hasTrendSlot}>
          <span role="img" aria-label=${trendType === 'up' ? '上升' : trendType === 'down' ? '下降' : '持平'}>${trendIcon}</span>
          <slot name="trend" @slotchange=${this.onTrendSlotChange}>${this.trend}</slot>
        </div>
      </article>
    `;
  }
}
