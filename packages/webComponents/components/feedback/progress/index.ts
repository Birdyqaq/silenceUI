import { LitElement, css, html, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { baseControlStyles } from '../../_shared/styles';

@customElement('su-progress')
export class SuProgress extends LitElement {
  @property({ type: Number }) percent = 0;
  @property({ type: String }) status: 'normal' | 'success' | 'error' = 'normal';
  @property({ type: Boolean }) showText = true;
  @property({ type: String }) strokeHeight = '8px';

  static styles = [
    baseControlStyles,
    css`
      :host {
        display: block;
      }

      .progress {
        display: flex;
        align-items: center;
        gap: 10px;
      }

      .track {
        flex: 1;
        height: var(--stroke-height, 8px);
        border-radius: 999px;
        background: var(--su-bg-muted);
        overflow: hidden;
      }

      .bar {
        height: 100%;
        border-radius: 999px;
        background: var(--su-color-primary);
        transition: width 0.3s ease;
      }

      .bar.success {
        background: var(--su-color-success);
      }

      .bar.error {
        background: var(--su-color-error);
      }

      .text {
        flex: none;
        min-width: 40px;
        text-align: right;
        font-size: var(--su-font-size-xs);
        color: var(--su-text-2);
      }
    `,
  ];

  willUpdate() {
    this.style.setProperty('--stroke-height', this.strokeHeight);
  }

  private get clampedPercent() {
    return Number.isFinite(this.percent) ? Math.min(100, Math.max(0, this.percent)) : 0;
  }

  render() {
    const percent = this.clampedPercent;
    return html`
      <div
        class="progress"
        role="progressbar"
        aria-valuenow=${percent}
        aria-valuemin="0"
        aria-valuemax="100"
      >
        <div class="track">
          <div class="bar ${this.status}" style="width: ${percent}%"></div>
        </div>
        ${this.showText ? html`<span class="text">${percent}%</span>` : nothing}
      </div>
    `;
  }
}
