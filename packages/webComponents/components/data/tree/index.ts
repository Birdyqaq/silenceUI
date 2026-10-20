import { LitElement, css, html, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { baseControlStyles, focusRingStyles } from '../../_shared/styles';
import { parseJsonArray } from '../../_shared/utils';
import '../../icon';

interface TreeNode {
  key: string;
  label: string;
  disabled?: boolean;
  children?: TreeNode[];
}

interface VisibleTreeNode {
  node: TreeNode;
  level: number;
  parentKey?: string;
}

@customElement('su-tree')
export class SuTree extends LitElement {
  @property({ type: Array, attribute: false }) nodes: TreeNode[] = [];
  @property({ type: String }) nodesJson = '';
  @property({ type: String }) selectedKey = '';
  @property({ type: Array, attribute: false }) expandedKeys: string[] = [];
  @property({ type: Boolean }) checkable = false;
  @property({ type: Array, attribute: false }) checkedKeys: string[] = [];
  @property({ type: Boolean }) checkStrictly = false;

  @state() private focusedKey = '';

  static styles = [
    baseControlStyles,
    focusRingStyles,
    css`
      :host {
        display: block;
      }

      .tree {
        display: grid;
        gap: 2px;
      }

      .item {
        display: grid;
        grid-template-columns: 24px minmax(0, 1fr);
        align-items: center;
        min-height: 34px;
        padding-left: calc((var(--tree-level) - 1) * 20px);
        border-radius: var(--su-radius-sm);
      }

      .item:hover .label:not(:disabled) {
        background: var(--su-bg-hover);
      }

      .label[aria-selected='true'] {
        background: rgba(var(--su-color-primary-rgb), 0.12);
        color: var(--su-color-primary);
      }

      .label:disabled {
        color: var(--su-text-3);
        opacity: 0.6;
      }

      button {
        border: none;
        background: transparent;
        color: inherit;
        cursor: pointer;
      }

      .toggle {
        width: 24px;
        height: 24px;
        padding: 0;
        border-radius: var(--su-radius-sm);
      }

      .toggle.placeholder {
        visibility: hidden;
      }

      .label {
        min-width: 0;
        padding: 7px 8px;
        text-align: left;
        font-size: var(--su-font-size-sm);
      }

      button:disabled {
        cursor: not-allowed;
      }
      .check {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 16px;
        height: 16px;
        margin-right: 6px;
        border: 1px solid var(--su-border-color);
        border-radius: 3px;
        vertical-align: middle;
      }
      .check.active {
        color: var(--su-color-primary);
        border-color: var(--su-color-primary);
        background: rgba(var(--su-color-primary-rgb), 0.1);
      }
    `,
  ];

  private get mergedNodes() {
    const nodes =
      Array.isArray(this.nodes) && this.nodes.length > 0
        ? this.nodes
        : parseJsonArray<unknown>(this.nodesJson, []);
    return this.validNodes(nodes);
  }

  /** 只接纳具备字符串 key/label 的节点；保留原对象作为事件 detail。 */
  private validNodes(value: unknown): TreeNode[] {
    if (!Array.isArray(value)) return [];
    return value.filter(
      (node): node is TreeNode =>
        node !== null &&
        typeof node === 'object' &&
        typeof node.key === 'string' &&
        typeof node.label === 'string'
    );
  }

  private childrenOf(node: TreeNode) {
    return this.validNodes(node.children).filter((child) => child !== node);
  }

  private get visibleNodes() {
    const visible: VisibleTreeNode[] = [];
    const visited = new Set<TreeNode>();
    const visit = (nodes: TreeNode[], level: number, parentKey?: string) => {
      nodes.forEach((node) => {
        if (visited.has(node)) return;
        visited.add(node);
        visible.push({ node, level, parentKey });
        const children = this.childrenOf(node);
        if (children.length && this.expandedKeys.includes(node.key)) {
          visit(children, level + 1, node.key);
        }
      });
    };
    visit(this.mergedNodes, 1);
    return visible;
  }

  private toggleNode(node: TreeNode) {
    if (node.disabled || !this.childrenOf(node).length) return;
    const expanded = !this.expandedKeys.includes(node.key);
    this.expandedKeys = expanded
      ? [...this.expandedKeys, node.key]
      : this.expandedKeys.filter((key) => key !== node.key);
    this.dispatchEvent(
      new CustomEvent('expand', {
        detail: { key: node.key, expanded, node },
        bubbles: true,
        composed: true,
      })
    );
  }

  private selectNode(node: TreeNode) {
    if (node.disabled) return;
    this.selectedKey = node.key;
    this.dispatchEvent(
      new CustomEvent('select', {
        detail: { key: node.key, node },
        bubbles: true,
        composed: true,
      })
    );
  }

  /** Disabled subtrees are independent boundaries and never participate in cascading checks. */
  private checkState(node: TreeNode, seen = new Set<TreeNode>()): 'true' | 'false' | 'mixed' {
    if (seen.has(node)) return 'false';
    seen.add(node);
    if (this.checkStrictly || node.disabled)
      return this.checkedKeys.includes(node.key) ? 'true' : 'false';
    const children = this.childrenOf(node).filter((child) => !child.disabled && !seen.has(child));
    if (!children.length) return this.checkedKeys.includes(node.key) ? 'true' : 'false';
    const states = children.map((child) => this.checkState(child, new Set(seen)));
    return states.every((state) => state === 'true')
      ? 'true'
      : states.some((state) => state !== 'false')
        ? 'mixed'
        : 'false';
  }

  private checkNode(node: TreeNode) {
    if (node.disabled) return;
    const checked = this.checkState(node) !== 'true';
    const keys = new Set(this.checkedKeys);
    const visited = new Set<TreeNode>();
    const toggle = (item: TreeNode) => {
      if (item.disabled || visited.has(item)) return;
      visited.add(item);
      if (checked) keys.add(item.key);
      else keys.delete(item.key);
      if (!this.checkStrictly) this.childrenOf(item).forEach(toggle);
    };
    toggle(node);
    this.checkedKeys = [...keys];
    const halfCheckedKeys: string[] = [];
    const normalized = new Set(this.checkedKeys);
    visited.clear();
    const collect = (item: TreeNode) => {
      if (visited.has(item)) return;
      visited.add(item);
      if (item.disabled) return;
      const state = this.checkState(item);
      if (state === 'true') normalized.add(item.key);
      else normalized.delete(item.key);
      if (state === 'mixed') halfCheckedKeys.push(item.key);
      this.childrenOf(item).forEach(collect);
    };
    this.mergedNodes.forEach(collect);
    this.checkedKeys = [...normalized];
    this.dispatchEvent(
      new CustomEvent('check', {
        detail: { key: node.key, checked, checkedKeys: [...this.checkedKeys], halfCheckedKeys },
        bubbles: true,
        composed: true,
      })
    );
  }

  private focusNode(key: string) {
    this.focusedKey = key;
    void this.updateComplete.then(() => {
      Array.from(this.shadowRoot?.querySelectorAll<HTMLButtonElement>('.label') ?? [])
        .find((button) => button.dataset.key === key)
        ?.focus();
    });
  }

  private onKeyDown(event: KeyboardEvent, entry: VisibleTreeNode) {
    const visible = this.visibleNodes;
    const enabled = visible.filter(({ node }) => !node.disabled);
    const currentIndex = enabled.findIndex(({ node }) => node.key === entry.node.key);
    if (currentIndex < 0) return;

    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      const offset = event.key === 'ArrowDown' ? 1 : -1;
      const next = enabled[(currentIndex + offset + enabled.length) % enabled.length];
      this.focusNode(next.node.key);
    } else if (event.key === 'Home' || event.key === 'End') {
      event.preventDefault();
      this.focusNode((event.key === 'Home' ? enabled[0] : enabled.at(-1))!.node.key);
    } else if (event.key === 'ArrowRight' && this.childrenOf(entry.node).length) {
      event.preventDefault();
      if (!this.expandedKeys.includes(entry.node.key)) this.toggleNode(entry.node);
      else {
        const child = this.childrenOf(entry.node).find((node) => !node.disabled);
        if (child) this.focusNode(child.key);
      }
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      if (this.expandedKeys.includes(entry.node.key)) this.toggleNode(entry.node);
      else if (entry.parentKey) this.focusNode(entry.parentKey);
    } else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      if (event.key === ' ' && this.checkable) this.checkNode(entry.node);
      else this.selectNode(entry.node);
    }
  }

  render() {
    const visible = this.visibleNodes;
    // 焦点与选择独立：方向键移动后，Tab 再次进入时回到最近聚焦的可用节点。
    const focusKey =
      [this.focusedKey, this.selectedKey].find((key) =>
        visible.some(({ node }) => node.key === key && !node.disabled)
      ) ??
      visible.find(({ node }) => !node.disabled)?.node.key ??
      '';

    return html`
      <div class="tree" role="tree" aria-label="树形列表">
        ${visible.map((entry) => {
          const { node, level } = entry;
          const hasChildren = this.childrenOf(node).length > 0;
          const expanded = this.expandedKeys.includes(node.key);
          return html`
            <div class="item" role="presentation" style=${`--tree-level: ${level}`}>
              <button
                class="toggle ${hasChildren ? '' : 'placeholder'}"
                type="button"
                tabindex="-1"
                aria-label=${expanded ? `收起 ${node.label}` : `展开 ${node.label}`}
                ?disabled=${node.disabled || !hasChildren}
                @click=${() => this.toggleNode(node)}
              >
                <su-icon name=${expanded ? 'chevron-down' : 'chevron-right'}></su-icon>
              </button>
              <button
                class="label"
                data-key=${node.key}
                type="button"
                role="treeitem"
                aria-level=${level}
                aria-selected=${node.key === this.selectedKey ? 'true' : 'false'}
                aria-checked=${this.checkable ? this.checkState(node) : nothing}
                aria-disabled=${node.disabled ? 'true' : 'false'}
                aria-expanded=${hasChildren ? String(expanded) : nothing}
                tabindex=${node.key === focusKey ? 0 : -1}
                ?disabled=${Boolean(node.disabled)}
                @focus=${() => {
                  this.focusedKey = node.key;
                }}
                @click=${() => (this.checkable ? this.checkNode(node) : this.selectNode(node))}
                @keydown=${(event: KeyboardEvent) => this.onKeyDown(event, entry)}
              >
                ${this.checkable
                  ? html`<span
                      class="check ${this.checkState(node) !== 'false' ? 'active' : ''}"
                      aria-hidden="true"
                      >${this.checkState(node) === 'true'
                        ? html`<su-icon name="check"></su-icon>`
                        : this.checkState(node) === 'mixed'
                          ? '−'
                          : ''}</span
                    >`
                  : nothing}
                ${node.label}
              </button>
            </div>
          `;
        })}
      </div>
    `;
  }
}

export type { TreeNode };
