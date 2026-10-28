import { LitElement, css, html, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';
import { FormValueController, formNameConverter } from '../../_shared/form';
import {
  choiceKeys,
  selectedChoices,
  choiceValidity,
  choiceStyles,
  type ChoiceEntry,
} from '../../_shared/choice';
import { baseControlStyles, focusRingStyles } from '../../_shared/styles';

export interface TransferItem {
  key: string;
  label: string;
  disabled?: boolean;
}
type Direction = 'left' | 'right';

@customElement('su-transfer')
export class SuTransfer extends LitElement {
  static formAssociated = true;
  @property({ attribute: false }) items: TransferItem[] = [];
  @property({ attribute: false }) targetKeys: string[] = [];
  @property({ type: Boolean }) searchable = false;
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ type: Boolean }) required = false;
  @property({ type: String, reflect: true, converter: formNameConverter }) name = '';
  @property({ type: String }) label = '';
  @state() private leftQuery = '';
  @state() private rightQuery = '';
  @state() private leftChecked: string[] = [];
  @state() private rightChecked: string[] = [];
  private selected = new Map<string, ChoiceEntry>();
  private defaults: string[] = [];
  private readonly formValue = new FormValueController(this, () => {
    if (this.formValue.disabled) return null;
    const data = new FormData();
    if (this.name) this.enabledKeys.forEach((key) => data.append(this.name, key));
    return data;
  });

  static styles = [
    baseControlStyles,
    focusRingStyles,
    choiceStyles,
    css`
      .transfer {
        display: grid;
        grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
        gap: 12px;
        align-items: stretch;
      }
      .panel {
        min-width: 0;
        border: 1px solid var(--su-border-color);
        border-radius: var(--su-radius-sm);
        background: var(--su-bg-card);
        overflow: hidden;
      }
      .panel-title {
        width: 100%;
        text-align: left;
        border: 0;
        border-bottom: 1px solid var(--su-border-color);
        padding: 10px;
        background: var(--su-bg-muted);
      }
      .panel-title[aria-invalid='true'] {
        color: var(--su-color-error);
      }
      .search-wrap {
        padding: 8px;
      }
      .all,
      .row {
        display: flex;
        gap: 8px;
        align-items: center;
        padding: 8px 10px;
        overflow-wrap: anywhere;
        cursor: pointer;
      }
      .all {
        border-bottom: 1px solid var(--su-border-color);
      }
      .row:has(input:disabled) {
        color: var(--su-text-3);
        cursor: not-allowed;
      }
      input[type='checkbox'] {
        accent-color: var(--su-color-primary);
        flex: none;
      }
      ul {
        list-style: none;
        padding: 0;
        margin: 0;
        height: 220px;
        overflow: auto;
      }
      .actions {
        display: flex;
        flex-direction: column;
        gap: 10px;
        align-self: center;
      }
      .move {
        border: 1px solid var(--su-border-color);
        background: var(--su-bg-card);
        padding: 8px;
        border-radius: var(--su-radius-sm);
      }
      .move:not(:disabled) {
        color: var(--su-color-primary);
        border-color: var(--su-color-primary);
      }
      @media (max-width: 560px) {
        .transfer {
          grid-template-columns: minmax(0, 1fr);
        }
        .actions {
          flex-direction: row;
          justify-content: center;
        }
        ul {
          height: 160px;
        }
      }
    `,
  ];

  private get available() {
    const result = new Map<string, ChoiceEntry>();
    (Array.isArray(this.items) ? this.items : []).forEach((item) => {
      if (
        item &&
        typeof item.key === 'string' &&
        item.key &&
        typeof item.label === 'string' &&
        !result.has(item.key)
      )
        result.set(item.key, {
          key: item.key,
          label: item.label,
          disabled: Boolean(item.disabled),
        });
    });
    return result;
  }
  private get keys() {
    return choiceKeys(this.targetKeys);
  }
  private get targetEntries() {
    return selectedChoices(this.keys, this.available, this.selected);
  }
  private get enabledKeys() {
    const entries = this.targetEntries;
    return this.keys.filter((key) => !entries.get(key)?.disabled);
  }

  private rows(side: Direction, filtered = true): ChoiceEntry[] {
    const keys = new Set(this.keys);
    const entries =
      side === 'left'
        ? [...this.available.values()].filter((item) => !keys.has(item.key))
        : [...this.targetEntries.values()];
    const query = (side === 'left' ? this.leftQuery : this.rightQuery).trim().toLocaleLowerCase();
    return filtered
      ? entries.filter((item) => item.label.toLocaleLowerCase().includes(query))
      : entries;
  }

  protected willUpdate() {
    this.selected = this.targetEntries;
    if (!this.searchable) {
      this.leftQuery = '';
      this.rightQuery = '';
    }
    // 每侧只归一化一次，避免全选后按每个 key 重建整个源列表。
    const left = new Set(
      this.rows('left', false)
        .filter((item) => !item.disabled)
        .map((item) => item.key)
    );
    const right = new Set(
      this.rows('right', false)
        .filter((item) => !item.disabled)
        .map((item) => item.key)
    );
    this.leftChecked = this.leftChecked.filter((key) => left.has(key));
    this.rightChecked = this.rightChecked.filter((key) => right.has(key));
    if (this.formValue.disabled) {
      this.leftChecked = [];
      this.rightChecked = [];
    }
  }
  protected updated() {
    this.formValue.sync();
  }
  firstUpdated() {
    this.defaults = this.keys;
  }
  formDisabledCallback(disabled: boolean) {
    this.formValue.setDisabled(disabled);
  }
  formResetCallback() {
    this.targetKeys = [...this.defaults];
    this.leftQuery = '';
    this.rightQuery = '';
    this.leftChecked = [];
    this.rightChecked = [];
  }
  formStateRestoreCallback(value: string | File | FormData | null) {
    if (value instanceof FormData) this.targetKeys = choiceKeys(value.getAll(this.name));
    else if (typeof value === 'string') this.targetKeys = choiceKeys([value]);
  }
  focus(options?: FocusOptions) {
    if (!this.formValue.disabled)
      this.renderRoot.querySelector<HTMLButtonElement>('[data-form-anchor]')?.focus(options);
  }

  private checked(side: Direction) {
    return side === 'left' ? this.leftChecked : this.rightChecked;
  }
  private setChecked(side: Direction, keys: string[]) {
    if (side === 'left') this.leftChecked = keys;
    else this.rightChecked = keys;
  }
  private toggle(side: Direction, key: string, checked: boolean) {
    if (
      this.formValue.disabled ||
      !this.rows(side).some((item) => item.key === key && !item.disabled)
    )
      return;
    this.setChecked(
      side,
      checked
        ? choiceKeys([...this.checked(side), key])
        : this.checked(side).filter((entry) => entry !== key)
    );
  }
  private toggleAll(side: Direction, checked: boolean) {
    if (this.formValue.disabled) return;
    const visible = new Set(
      this.rows(side)
        .filter((item) => !item.disabled)
        .map((item) => item.key)
    );
    this.setChecked(
      side,
      checked
        ? choiceKeys([...this.checked(side), ...visible])
        : this.checked(side).filter((key) => !visible.has(key))
    );
  }
  private movable(direction: Direction) {
    const side = direction === 'right' ? 'left' : 'right';
    const checked = new Set(this.checked(side));
    return this.rows(side)
      .filter((item) => !item.disabled && checked.has(item.key))
      .map((item) => item.key);
  }

  private move(direction: Direction) {
    if (this.formValue.disabled) return;
    const movedKeys = this.movable(direction);
    if (!movedKeys.length) return;
    const moved = new Set(movedKeys);
    const restoreFocus = Boolean(this.shadowRoot?.activeElement?.matches('.move'));
    this.targetKeys =
      direction === 'right'
        ? choiceKeys([...this.keys, ...movedKeys])
        : this.keys.filter((key) => !moved.has(key));
    const side = direction === 'right' ? 'left' : 'right';
    this.setChecked(
      side,
      this.checked(side).filter((key) => !moved.has(key))
    );
    this.dispatchEvent(
      new CustomEvent('change', {
        detail: { targetKeys: [...this.targetKeys], direction, movedKeys: [...movedKeys] },
        bubbles: true,
        composed: true,
      })
    );
    void this.updateComplete.then(() => {
      const root = this.getRootNode() as Document | ShadowRoot;
      if (
        restoreFocus &&
        this.isConnected &&
        (root.activeElement === this ||
          this.ownerDocument.activeElement === this.ownerDocument.body)
      )
        this.focus();
    });
  }

  private renderPanel(side: Direction) {
    const title = side === 'left' ? '可选项' : '已选项';
    const rows = this.rows(side);
    const enabled = rows.filter((item) => !item.disabled);
    const checked = new Set(this.checked(side));
    const count = enabled.filter((item) => checked.has(item.key)).length;
    const disabled = this.formValue.disabled;
    return html`<section class="panel ${side}" aria-label=${title}>
      ${side === 'left'
        ? html`<button
            id="transfer-anchor"
            class="panel-title"
            data-form-anchor
            type="button"
            ?disabled=${disabled}
            aria-label=${this.label || '选项分配'}
            title="进入可选项列表"
            @click=${() =>
              this.renderRoot
                .querySelector<HTMLInputElement>('.left .row input:not(:disabled)')
                ?.focus()}
          >
            ${title} (${this.rows(side, false).length})
          </button>`
        : html`<div class="panel-title">${title} (${this.rows(side, false).length})</div>`}
      ${this.searchable
        ? html`<div class="search-wrap">
            <input
              type="search"
              class="search"
              aria-label=${`搜索${title}`}
              .value=${side === 'left' ? this.leftQuery : this.rightQuery}
              ?disabled=${disabled}
              @input=${(event: Event) => {
                event.stopPropagation();
                if (disabled) return;
                if (side === 'left') this.leftQuery = (event.target as HTMLInputElement).value;
                else this.rightQuery = (event.target as HTMLInputElement).value;
              }}
              @change=${(event: Event) => event.stopPropagation()}
            />
          </div>`
        : nothing}
      <label class="all"
        ><input
          type="checkbox"
          aria-label=${`全选${title}`}
          ?disabled=${disabled || !enabled.length}
          .checked=${enabled.length > 0 && count === enabled.length}
          .indeterminate=${count > 0 && count < enabled.length}
          @change=${(event: Event) => {
            event.stopPropagation();
            this.toggleAll(side, (event.target as HTMLInputElement).checked);
          }}
        />全选当前结果 (${count}/${enabled.length})</label
      >
      <ul aria-label=${`${title}列表`}>
        ${repeat(
          rows,
          (item) => item.key,
          (item) =>
            html`<li>
              <label class="row"
                ><input
                  type="checkbox"
                  data-key=${item.key}
                  .checked=${checked.has(item.key)}
                  ?disabled=${disabled || item.disabled}
                  @change=${(event: Event) => {
                    event.stopPropagation();
                    this.toggle(side, item.key, (event.target as HTMLInputElement).checked);
                  }}
                />${item.label}</label
              >
            </li>`
        )}
        ${rows.length ? nothing : html`<li class="empty">暂无匹配项</li>`}
      </ul>
    </section>`;
  }

  render() {
    const disabled = this.formValue.disabled;
    return html`${this.label
        ? html`<label class="field-label" for="transfer-anchor">${this.label}</label>`
        : nothing}
      <div class="transfer" @input=${(event: Event) => event.stopPropagation()}>
        ${this.renderPanel('left')}
        <div class="actions">
          <button
            class="move to-right"
            type="button"
            aria-label="移入已选项"
            ?disabled=${disabled || !this.movable('right').length}
            @click=${() => this.move('right')}
          >
            添加 →
          </button>
          <button
            class="move to-left"
            type="button"
            aria-label="移回可选项"
            ?disabled=${disabled || !this.movable('left').length}
            @click=${() => this.move('left')}
          >
            ← 移除
          </button>
        </div>
        ${this.renderPanel('right')}
      </div>
      ${choiceValidity(this.enabledKeys, this.required, disabled)}`;
  }
}
declare global {
  interface HTMLElementTagNameMap {
    'su-transfer': SuTransfer;
  }
}
