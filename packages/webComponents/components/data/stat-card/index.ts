import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { baseControlStyles } from '../../_shared/styles';

@customElement('su-stat-card')
export class SuStatCard extends LitElement {
  @property({ type: String }) title = '';
  @property({ type: String }) value = '';
  @property({ type: String }) trend = '';
  @property({ type: String }) trendType: 'up' | 'down' | 'flat' = 'flat';

  static styles = [
    baseControlStyles,
    css`
      :host {
        display: block;
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
      }

      .value {
        color: var(--su-text-1);
        font-size: 26px;
        line-height: 1.2;
        font-weight: 700;
      }

      .trend {
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
    `
  ];

  render() {
    return html`
      <article class="card">
        <div class="title">${this.title}</div>
        <div class="value">${this.value}</div>
        <div class="trend ${this.trendType}">${this.trend}</div>
      </article>
    `;
  }
}
