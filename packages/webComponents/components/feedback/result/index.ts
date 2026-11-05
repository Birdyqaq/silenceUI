import { LitElement, css, html, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { baseControlStyles } from '../../_shared/styles';

const statuses = {
  success: { icon: '✓', label: '成功' },
  empty: { icon: '○', label: '暂无数据' },
  forbidden: { icon: '⊘', label: '无权限' },
  error: { icon: '!', label: '失败' },
};

export type ResultStatus = keyof typeof statuses;

@customElement('su-result')
export class SuResult extends LitElement {
  @property() status: ResultStatus = 'empty';
  @property() heading = '';
  @property() description = '';

  static styles = [
    baseControlStyles,
    css`
      :host {
        display: block;
        min-width: 0;
        text-align: center;
        overflow-wrap: anywhere;
      }
      section {
        padding: clamp(12px, 4vw, 32px);
      }
      [role='img'] {
        font-size: 2rem;
        color: var(--su-color-primary);
      }
      h2 {
        margin: 8px 0;
      }
      p {
        color: var(--su-text-2);
      }
      .actions {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 8px;
      }
    `,
  ];

  render() {
    const status = Object.prototype.hasOwnProperty.call(statuses, this.status)
      ? statuses[this.status]
      : statuses.empty;
    return html`<section aria-labelledby="heading">
      <span role="img" aria-label=${status.label}>${status.icon}</span>
      <h2 id="heading">${this.heading || status.label}</h2>
      ${this.description ? html`<p>${this.description}</p>` : nothing}
      <div class="actions"><slot name="actions"></slot></div>
    </section>`;
  }
}
declare global {
  interface HTMLElementTagNameMap {
    'su-result': SuResult;
  }
}
