import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';
import { baseControlStyles, focusRingStyles } from '../../_shared/styles';

export interface CollapseItem {
  key: string;
  label: string;
  content?: string;
  disabled?: boolean;
}

@customElement('su-collapse')
export class SuCollapse extends LitElement {
  @property({ attribute: false }) items: CollapseItem[] = [];
  @property({ attribute: false }) activeKeys: string[] = [];
  @property({ type: Boolean }) accordion = false;

  static styles = [
    baseControlStyles,
    focusRingStyles,
    css`
      :host {
        display: block;
        border: 1px solid var(--su-border-color);
        border-radius: var(--su-radius-sm);
        overflow: hidden;
      }
      section + section {
        border-top: 1px solid var(--su-border-color);
      }
      button {
        display: flex;
        gap: 12px;
        align-items: center;
        width: 100%;
        padding: 14px 16px;
        border: 0;
        background: var(--su-bg-muted);
        color: var(--su-text-1);
        font: inherit;
        text-align: left;
        cursor: pointer;
      }
      button:disabled {
        color: var(--su-text-3);
        cursor: not-allowed;
      }
      .arrow {
        color: var(--su-color-primary);
      }
      .panel {
        padding: 16px;
        background: var(--su-bg-card);
        line-height: 1.6;
      }
      [hidden] {
        display: none;
      }
    `,
  ];

  /** 忽略非法项和重复 key，保证面板关联与事件值唯一。 */
  private get entries(): CollapseItem[] {
    const seen = new Set<string>();
    return (Array.isArray(this.items) ? this.items : []).filter((item) => {
      if (
        !item ||
        typeof item.key !== 'string' ||
        !item.key ||
        typeof item.label !== 'string' ||
        seen.has(item.key)
      )
        return false;
      seen.add(item.key);
      return true;
    });
  }

  /** 数据替换后只读取仍存在的 key；手风琴模式只展开首个匹配项。 */
  private get opened(): string[] {
    const keys = Array.isArray(this.activeKeys) ? this.activeKeys : [];
    const available = new Set(this.entries.map((item) => item.key));
    const valid = [...new Set(keys)].filter((key) => available.has(key));
    return this.accordion ? valid.slice(0, 1) : valid;
  }

  private toggle(item: CollapseItem) {
    const latest = this.entries.find((entry) => entry.key === item.key);
    if (!latest || latest.disabled) return;
    item = latest;
    const keys = this.opened;
    this.activeKeys = keys.includes(item.key)
      ? keys.filter((key) => key !== item.key)
      : this.accordion
        ? [item.key]
        : [...keys, item.key];
    this.dispatchEvent(
      new CustomEvent('change', {
        detail: { activeKeys: [...this.activeKeys], key: item.key },
        bubbles: true,
        composed: true,
      })
    );
  }

  /** 标题按钮保留原生 Enter/Space，方向键在可用标题之间移动。 */
  private onKeydown(event: KeyboardEvent) {
    const buttons = [
      ...this.renderRoot.querySelectorAll<HTMLButtonElement>('button:not(:disabled)'),
    ];
    const index = buttons.indexOf(event.target as HTMLButtonElement);
    if (index < 0) return;
    let next: number;
    switch (event.key) {
      case 'ArrowDown':
        next = (index + 1) % buttons.length;
        break;
      case 'ArrowUp':
        next = (index - 1 + buttons.length) % buttons.length;
        break;
      case 'Home':
        next = 0;
        break;
      case 'End':
        next = buttons.length - 1;
        break;
      default:
        return;
    }
    event.preventDefault();
    buttons[next].focus();
  }

  render() {
    const opened = this.opened;
    return html`${repeat(
      this.entries,
      (item) => item.key,
      (item, index) => html`
        <section>
          <button
            type="button"
            id=${`header-${index}`}
            aria-expanded=${String(opened.includes(item.key))}
            aria-controls=${`panel-${index}`}
            ?disabled=${item.disabled}
            @click=${() => this.toggle(item)}
            @keydown=${this.onKeydown}
          >
            <span class="arrow" aria-hidden="true">${opened.includes(item.key) ? '−' : '+'}</span
            >${item.label}
          </button>
          <div
            class="panel"
            id=${`panel-${index}`}
            role="region"
            aria-labelledby=${`header-${index}`}
            ?hidden=${!opened.includes(item.key)}
          >
            <slot name=${item.key}>${item.content ?? ''}</slot>
          </div>
        </section>
      `
    )}`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'su-collapse': SuCollapse;
  }
}
