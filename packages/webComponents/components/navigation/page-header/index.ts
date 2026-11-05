import { LitElement, css, html, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { baseControlStyles, focusRingStyles } from '../../_shared/styles';

@customElement('su-page-header')
export class SuPageHeader extends LitElement {
  @property({ type: String }) heading = '';
  @property({ type: String }) description = '';
  @property({ type: Number }) level = 1;
  @property({ type: Boolean, attribute: 'show-back' }) showBack = false;
  @property({ type: String, attribute: 'back-label' }) backLabel = '返回';

  static styles = [
    baseControlStyles,
    focusRingStyles,
    css`
      :host {
        display: block;
        min-width: 0;
      }
      .main {
        display: flex;
        flex-wrap: wrap;
        align-items: flex-start;
        gap: 12px;
      }
      .content {
        flex: 1 1 240px;
        min-width: 0;
        overflow-wrap: anywhere;
      }
      .actions {
        display: flex;
        flex-wrap: wrap;
        max-width: 100%;
        gap: 8px;
      }
      [role='heading'] {
        font-size: 1.5rem;
        font-weight: 600;
        color: var(--su-text-1);
      }
      p {
        margin: 6px 0 0;
        color: var(--su-text-2);
      }
      button {
        font: inherit;
        padding: 6px 10px;
        color: var(--su-text-1);
        background: var(--su-bg-card);
        border: 1px solid var(--su-border-color);
        border-radius: var(--su-radius-sm);
        cursor: pointer;
      }
      @media (max-width: 480px) {
        .actions {
          flex-basis: 100%;
        }
      }
    `,
  ];

  private back() {
    this.dispatchEvent(new CustomEvent('back', { bubbles: true, composed: true }));
  }

  render() {
    const level =
      Number.isInteger(this.level) && this.level >= 1 && this.level <= 6 ? this.level : 1;
    return html`<header>
      <slot name="breadcrumb"></slot>
      <div class="main">
        ${this.showBack
          ? html`<button type="button" @click=${this.back}>${this.backLabel || '返回'}</button>`
          : nothing}
        <div class="content">
          ${this.heading
            ? html`<div role="heading" aria-level=${level}>${this.heading}</div>`
            : nothing}
          ${this.description ? html`<p>${this.description}</p>` : nothing}
        </div>
        <div class="actions"><slot name="actions"></slot></div>
      </div>
    </header>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'su-page-header': SuPageHeader;
  }
}
