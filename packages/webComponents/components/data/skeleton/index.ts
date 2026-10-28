import { LitElement, css, html, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { baseControlStyles } from '../../_shared/styles';

@customElement('su-skeleton')
export class SuSkeleton extends LitElement {
  @property({ type: Number }) rows = 3;
  @property({ type: Boolean }) avatar = false;
  @property({ type: Boolean }) animated = true;
  /** 为 false 时显示插槽中的真实内容 */
  @property({ type: Boolean }) loading = true;

  static styles = [
    baseControlStyles,
    css`
      :host {
        display: block;
      }

      .skeleton {
        display: flex;
        gap: 12px;
      }

      .avatar {
        flex: none;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: var(--su-bg-muted);
      }

      .lines {
        flex: 1;
        display: grid;
        gap: 10px;
        align-content: start;
      }

      .row {
        height: 14px;
        border-radius: 4px;
        background: var(--su-bg-muted);
      }

      .row:first-child {
        width: 38%;
      }

      .row:last-child {
        width: 62%;
      }

      .animated .avatar,
      .animated .row {
        background: linear-gradient(
          90deg,
          var(--su-bg-muted) 25%,
          var(--su-bg-hover) 50%,
          var(--su-bg-muted) 75%
        );
        background-size: 200% 100%;
        animation: shimmer 1.4s ease infinite;
      }

      @keyframes shimmer {
        from {
          background-position: 200% 0;
        }
        to {
          background-position: -200% 0;
        }
      }
      @media (prefers-reduced-motion: reduce) {
        .animated .avatar,
        .animated .row {
          animation: none;
        }
      }
    `,
  ];

  render() {
    if (!this.loading) return html`<slot></slot>`;
    const rows = Math.min(100, Math.max(1, Number.isFinite(this.rows) ? Math.floor(this.rows) : 3));
    return html`
      <div class="skeleton ${this.animated ? 'animated' : ''}" aria-busy="true">
        ${this.avatar ? html`<span class="avatar"></span>` : nothing}
        <div class="lines">
          ${Array.from({ length: rows }, () => html`<div class="row"></div>`)}
        </div>
      </div>
    `;
  }
}
