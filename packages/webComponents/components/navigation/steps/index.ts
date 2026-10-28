import { LitElement, css, html, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { baseControlStyles } from '../../_shared/styles';
import { parseJsonArray } from '../../_shared/utils';

interface StepItem {
  title: string;
  description?: string;
}

@customElement('su-steps')
export class SuSteps extends LitElement {
  @property({ type: Array, attribute: false }) items: StepItem[] = [];
  @property({ type: String }) itemsJson = '';
  /** 当前步骤下标，从 0 开始 */
  @property({ type: Number }) current = 0;

  static styles = [
    baseControlStyles,
    css`
      :host {
        display: block;
      }

      .steps {
        display: flex;
        gap: 12px;
      }

      .step {
        flex: 1;
        display: flex;
        gap: 10px;
        min-width: 0;
      }

      .indicator {
        flex: none;
        width: 26px;
        height: 26px;
        border-radius: 50%;
        display: grid;
        place-items: center;
        font-size: var(--su-font-size-sm);
        border: 1px solid var(--su-border-color);
        color: var(--su-text-3);
        background: var(--su-bg-card);
      }

      .step.finished .indicator {
        border-color: var(--su-color-primary);
        color: var(--su-color-primary);
        background: rgba(var(--su-color-primary-rgb), 0.1);
      }

      .step.active .indicator {
        border-color: var(--su-color-primary);
        background: var(--su-color-primary);
        color: var(--su-color-primary-contrast, #fff);
      }

      .content {
        min-width: 0;
        padding-top: 3px;
      }

      .title {
        overflow-wrap: anywhere;
        font-size: var(--su-font-size-sm);
        font-weight: 600;
        color: var(--su-text-3);
      }

      .step.active .title,
      .step.finished .title {
        color: var(--su-text-1);
      }

      .description {
        overflow-wrap: anywhere;
        margin-top: 2px;
        font-size: var(--su-font-size-xs);
        color: var(--su-text-3);
      }

      .connector {
        flex: 1;
        height: 1px;
        margin-top: 13px;
        background: var(--su-border-color);
      }

      .step.finished .connector {
        background: var(--su-color-primary);
      }
    `,
  ];

  private get mergedItems() {
    const items =
      Array.isArray(this.items) && this.items.length > 0
        ? this.items
        : parseJsonArray<StepItem>(this.itemsJson, []);
    return items
      .filter((item) => item && typeof item.title === 'string')
      .map((item) => ({
        title: item.title,
        description: typeof item.description === 'string' ? item.description : '',
      }));
  }

  render() {
    const list = this.mergedItems;
    // current === length 表示流程结束；非法数值回到起点，不修改调用方属性。
    const current = Math.min(
      list.length,
      Math.max(0, Number.isFinite(this.current) ? Math.floor(this.current) : 0)
    );
    return html`
      <div class="steps" role="list" aria-label="流程步骤">
        ${list.map((item, index) => {
          const state = index < current ? 'finished' : index === current ? 'active' : '';
          return html`
            <div
              class="step ${state}"
              role="listitem"
              aria-current=${index === current ? 'step' : 'false'}
              aria-label=${`${item.title}${index < current ? '，已完成' : index === current ? '，当前步骤' : '，未开始'}`}
            >
              <span class="indicator" aria-hidden="true">${index < current ? '✓' : index + 1}</span>
              <div class="content">
                <div class="title">${item.title}</div>
                ${item.description
                  ? html`<div class="description">${item.description}</div>`
                  : nothing}
              </div>
              ${index < list.length - 1 ? html`<span class="connector"></span>` : nothing}
            </div>
          `;
        })}
      </div>
    `;
  }
}

export type { StepItem };
