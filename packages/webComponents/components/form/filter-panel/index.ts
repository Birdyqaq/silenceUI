import { LitElement, css, html, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { baseControlStyles, focusRingStyles } from '../../_shared/styles';

export interface FilterPanelExpandDetail {
  expanded: boolean;
}

@customElement('su-filter-panel')
export class SuFilterPanel extends LitElement {
  @property({ type: Boolean }) expanded = false;
  @property({ type: Boolean }) pending = false;
  @property({ type: String }) label = '筛选条件';

  @state() private hasAdvanced = false;

  static styles = [
    baseControlStyles,
    focusRingStyles,
    css`
      :host {
        display: block;
        min-width: 0;
      }
      .panel {
        display: grid;
        gap: 12px;
        padding: 12px;
        border: 1px solid var(--su-border-color);
        border-radius: var(--su-radius-sm);
        background: var(--su-bg-card);
      }
      .fields,
      .actions {
        display: flex;
        flex-wrap: wrap;
        align-items: end;
        gap: 8px 12px;
        min-width: 0;
      }
      .fields[hidden] {
        display: none;
      }
      .advanced {
        padding-block-start: 10px;
        border-block-start: 1px solid var(--su-border-color);
      }
      button {
        font: inherit;
        color: inherit;
        background: var(--su-bg-card);
        border: 1px solid var(--su-border-color);
        border-radius: var(--su-radius-sm);
        min-height: 32px;
        padding: 4px 10px;
        cursor: pointer;
      }
      button.apply {
        border-color: var(--su-color-primary);
        color: var(--su-color-primary);
      }
      button:disabled {
        opacity: 0.5;
        cursor: default;
      }
    `,
  ];

  private updateAdvanced(event: Event) {
    const slot = event.currentTarget as HTMLSlotElement;
    this.hasAdvanced = slot.assignedElements().length > 0;
  }

  private toggle() {
    if (!this.hasAdvanced) return;
    this.expanded = !this.expanded;
    this.dispatchEvent(
      new CustomEvent<FilterPanelExpandDetail>('expand-change', {
        detail: { expanded: this.expanded },
        bubbles: true,
        composed: true,
      })
    );
  }

  private apply() {
    if (this.pending) return;
    this.dispatchEvent(new CustomEvent('apply', { bubbles: true, composed: true }));
  }

  private resetFilters() {
    if (this.pending) return;
    this.dispatchEvent(new CustomEvent('reset-filters', { bubbles: true, composed: true }));
  }

  render() {
    return html`<section class="panel" part="panel" aria-label=${this.label}>
      <div class="fields" part="fields"><slot></slot></div>
      <div class="actions" part="actions">
        <button type="button" class="apply" ?disabled=${this.pending} @click=${this.apply}>
          ${this.pending ? '查询中…' : '查询'}
        </button>
        <button type="button" ?disabled=${this.pending} @click=${this.resetFilters}>重置</button>
        ${this.hasAdvanced
          ? html`<button
              type="button"
              aria-controls="advanced"
              aria-expanded=${String(this.expanded)}
              @click=${this.toggle}
            >
              高级筛选
            </button>`
          : nothing}
      </div>
      <div
        id="advanced"
        class="fields advanced"
        part="advanced"
        ?hidden=${!this.expanded || !this.hasAdvanced}
      >
        <slot name="advanced" @slotchange=${this.updateAdvanced}></slot>
      </div>
    </section>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'su-filter-panel': SuFilterPanel;
  }
}
