import { LitElement, css, html, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { FormValueController, formNameConverter } from '../../_shared/form';
import {
  choiceKeys,
  selectedChoices,
  choiceValidity,
  choiceStyles,
  type ChoiceEntry,
} from '../../_shared/choice';
import { baseControlStyles, focusRingStyles } from '../../_shared/styles';
import '../../data/tree';
import type { SuTree, TreeNode } from '../../data/tree';

@customElement('su-tree-select')
export class SuTreeSelect extends LitElement {
  static formAssociated = true;
  @property({ attribute: false }) nodes: TreeNode[] = [];
  @property({ type: String }) value = '';
  @property({ attribute: false }) values: string[] = [];
  @property({ type: Boolean }) multiple = false;
  @property({ type: Boolean }) searchable = false;
  @property({ type: Boolean }) clearable = false;
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ type: Boolean }) required = false;
  @property({ type: String, reflect: true, converter: formNameConverter }) name = '';
  @property({ type: String }) label = '';
  @property({ type: String }) placeholder = '请选择';
  @state() private open = false;
  @state() private query = '';
  @state() private expandedKeys: string[] = [];
  private selected = new Map<string, ChoiceEntry>();
  private defaults = { value: '', values: [] as string[] };
  private readonly formValue = new FormValueController(this, () => {
    if (this.formValue.disabled) return null;
    if (!this.multiple) return this.enabledKeys[0] ?? '';
    const data = new FormData();
    if (this.name) this.enabledKeys.forEach((key) => data.append(this.name, key));
    return data;
  });

  static styles = [
    baseControlStyles,
    focusRingStyles,
    choiceStyles,
    css`
      .control {
        display: flex;
        gap: 6px;
      }
      .trigger {
        flex: 1;
        min-width: 0;
        text-align: left;
        overflow-wrap: anywhere;
      }
      .trigger,
      .clear {
        padding: 9px 10px;
        background: var(--su-bg-card);
        border: 1px solid var(--su-border-color);
        border-radius: var(--su-radius-sm);
      }
      .trigger[aria-invalid='true'] {
        border-color: var(--su-color-error);
      }
      .popup {
        position: absolute;
        z-index: 1100;
        top: 100%;
        left: 0;
        width: 100%;
        min-width: min(240px, 100%);
        max-height: 320px;
        overflow: auto;
        padding: 8px;
        border: 1px solid var(--su-border-color);
        background: var(--su-bg-card);
        box-shadow: var(--su-shadow-md);
        border-radius: var(--su-radius-sm);
      }
    `,
  ];

  /** 统一 key、循环引用与继承禁用状态；不修改调用方树。 */
  private get normalized() {
    const seen = new Set<unknown>();
    const keys = new Set<string>();
    const visit = (nodes: unknown, inherited = false): TreeNode[] => {
      if (!Array.isArray(nodes)) return [];
      return nodes.flatMap((node) => {
        if (
          !node ||
          typeof node.key !== 'string' ||
          !node.key ||
          typeof node.label !== 'string' ||
          seen.has(node) ||
          keys.has(node.key)
        )
          return [];
        seen.add(node);
        keys.add(node.key);
        const disabled = inherited || Boolean(node.disabled);
        return [
          { key: node.key, label: node.label, disabled, children: visit(node.children, disabled) },
        ];
      });
    };
    return visit(this.nodes);
  }

  private get available() {
    const result = new Map<string, ChoiceEntry>();
    const visit = (nodes: TreeNode[]) =>
      nodes.forEach((node) => {
        result.set(node.key, node);
        visit(node.children ?? []);
      });
    visit(this.normalized);
    return result;
  }

  private get keys() {
    return this.multiple ? choiceKeys(this.values) : choiceKeys([this.value]);
  }
  private get enabledKeys() {
    const entries = selectedChoices(this.keys, this.available, this.selected);
    return this.keys.filter((key) => !entries.get(key)?.disabled);
  }

  protected willUpdate() {
    this.selected = selectedChoices(this.keys, this.available, this.selected);
    if (!this.searchable) this.query = '';
    if (this.formValue.disabled) {
      this.open = false;
      this.query = '';
    }
  }
  protected updated() {
    this.formValue.sync();
  }
  firstUpdated() {
    this.defaults = { value: this.value, values: choiceKeys(this.values) };
  }
  formDisabledCallback(disabled: boolean) {
    this.formValue.setDisabled(disabled);
  }
  formResetCallback() {
    this.value = this.defaults.value;
    this.values = [...this.defaults.values];
    this.query = '';
    this.open = false;
  }
  formStateRestoreCallback(value: string | File | FormData | null) {
    if (typeof value === 'string') this.value = value;
    else if (value instanceof FormData) this.values = choiceKeys(value.getAll(this.name));
  }
  focus(options?: FocusOptions) {
    if (!this.formValue.disabled)
      this.renderRoot.querySelector<HTMLButtonElement>('.trigger')?.focus(options);
  }

  private outside = (event: Event) => {
    if (!event.composedPath().includes(this)) this.open = false;
  };
  connectedCallback() {
    super.connectedCallback();
    this.ownerDocument.addEventListener('click', this.outside);
  }
  disconnectedCallback() {
    this.ownerDocument.removeEventListener('click', this.outside);
    super.disconnectedCallback();
  }

  private async show(treeFocus = false) {
    if (this.formValue.disabled) return;
    this.open = true;
    await this.updateComplete;
    if (!this.isConnected || !this.open || this.formValue.disabled) return;
    const tree = this.renderRoot.querySelector<SuTree>('su-tree');
    if (!treeFocus && this.searchable)
      this.renderRoot.querySelector<HTMLInputElement>('.search')?.focus();
    else if (tree) {
      await tree.updateComplete;
      if (this.isConnected && this.open && !this.formValue.disabled)
        tree.shadowRoot?.querySelector<HTMLButtonElement>('.label[tabindex="0"]')?.focus();
    }
  }

  private onKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape' && this.open) {
      event.preventDefault();
      event.stopPropagation();
      this.open = false;
      this.focus();
    } else if (
      event.key === 'ArrowDown' &&
      (event.target as HTMLElement).matches('.trigger, .search')
    ) {
      event.preventDefault();
      void this.show(true);
    }
  }

  private choose(event: CustomEvent) {
    event.stopPropagation();
    const key = event.detail.key;
    const node = this.available.get(key);
    if (this.formValue.disabled || !node || node.disabled) return;
    if (this.multiple)
      this.values = this.keys.includes(key)
        ? this.keys.filter((entry) => entry !== key)
        : [...this.keys, key];
    else {
      this.value = key;
      this.open = false;
    }
    this.emitChange();
    if (
      !this.multiple &&
      this.open === false &&
      this.isConnected &&
      this.ownerDocument.activeElement === this
    )
      this.focus();
  }
  private emitChange() {
    this.dispatchEvent(
      new CustomEvent('change', {
        detail: { value: this.multiple ? [...choiceKeys(this.values)] : this.value },
        bubbles: true,
        composed: true,
      })
    );
  }

  render() {
    const disabled = this.formValue.disabled;
    const query = this.query.trim().toLocaleLowerCase();
    const expanded: string[] = [];
    const filter = (nodes: TreeNode[]): TreeNode[] =>
      nodes.flatMap((node) => {
        const children = filter(node.children ?? []);
        const match = node.label.toLocaleLowerCase().includes(query);
        if (query && !match && !children.length) return [];
        if (children.length) expanded.push(node.key);
        return [{ ...node, children }];
      });
    const nodes = filter(this.normalized);
    const text = this.keys.map((key) => this.selected.get(key)?.label ?? key).join('、');
    return html`<div @keydown=${this.onKeydown}>
      ${this.label ? html`<label class="field-label" for="trigger">${this.label}</label>` : nothing}
      <div class="control">
        <button
          id="trigger"
          data-form-anchor
          class="trigger"
          type="button"
          ?disabled=${disabled}
          aria-label=${this.label || this.placeholder}
          aria-haspopup="tree"
          aria-expanded=${String(this.open)}
          aria-controls="tree-popup"
          @click=${() => {
            if (disabled) return;
            if (this.open) this.open = false;
            else void this.show();
          }}
        >
          ${text || this.placeholder}
        </button>
        ${this.clearable && this.keys.length
          ? html`<button
              class="clear"
              type="button"
              aria-label="清空选择"
              ?disabled=${disabled}
              @click=${() => {
                if (this.formValue.disabled) return;
                this.value = '';
                this.values = [];
                this.emitChange();
              }}
            >
              清空
            </button>`
          : nothing}
      </div>
      ${choiceValidity(this.enabledKeys, this.required, disabled)}
      ${this.open && !disabled
        ? html`<div class="popup" id="tree-popup">
            ${this.searchable
              ? html`<input
                  class="search"
                  type="search"
                  aria-label="搜索树选项"
                  .value=${this.query}
                  @input=${(event: Event) => {
                    event.stopPropagation();
                    this.query = (event.target as HTMLInputElement).value;
                  }}
                  @change=${(event: Event) => event.stopPropagation()}
                />`
              : nothing}
            ${nodes.length
              ? html`<su-tree
                  .nodes=${nodes}
                  .selectedKey=${this.multiple ? '' : this.value}
                  .checkedKeys=${this.keys}
                  .checkable=${this.multiple}
                  .checkStrictly=${true}
                  .expandedKeys=${query ? expanded : this.expandedKeys}
                  @select=${this.choose}
                  @check=${this.choose}
                  @expand=${(event: CustomEvent) => {
                    event.stopPropagation();
                    const tree = event.target as SuTree;
                    this.expandedKeys = [...tree.expandedKeys];
                  }}
                ></su-tree>`
              : html`<div class="empty">暂无匹配项</div>`}
          </div>`
        : nothing}
    </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'su-tree-select': SuTreeSelect;
  }
}
