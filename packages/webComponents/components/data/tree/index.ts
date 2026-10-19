import { LitElement, css, html, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { baseControlStyles, focusRingStyles } from '../../_shared/styles';
import { parseJsonArray } from '../../_shared/utils';

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
    `,
  ];

  private get mergedNodes() {
    if (this.nodes.length > 0) return this.nodes;
    return parseJsonArray<TreeNode>(this.nodesJson, []);
  }

  private get visibleNodes() {
    const visible: VisibleTreeNode[] = [];
    const visit = (nodes: TreeNode[], level: number, parentKey?: string) => {
      nodes.forEach((node) => {
        visible.push({ node, level, parentKey });
        if (node.children?.length && this.expandedKeys.includes(node.key)) {
          visit(node.children, level + 1, node.key);
        }
      });
    };
    visit(this.mergedNodes, 1);
    return visible;
  }

  private toggleNode(node: TreeNode) {
    if (node.disabled || !node.children?.length) return;
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
    } else if (event.key === 'ArrowRight' && entry.node.children?.length) {
      event.preventDefault();
      if (!this.expandedKeys.includes(entry.node.key)) this.toggleNode(entry.node);
      else {
        const child = entry.node.children.find((node) => !node.disabled);
        if (child) this.focusNode(child.key);
      }
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      if (this.expandedKeys.includes(entry.node.key)) this.toggleNode(entry.node);
      else if (entry.parentKey) this.focusNode(entry.parentKey);
    } else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.selectNode(entry.node);
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
          const hasChildren = Boolean(node.children?.length);
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
                ${expanded ? '▾' : '▸'}
              </button>
              <button
                class="label"
                data-key=${node.key}
                type="button"
                role="treeitem"
                aria-level=${level}
                aria-selected=${node.key === this.selectedKey ? 'true' : 'false'}
                aria-disabled=${node.disabled ? 'true' : 'false'}
                aria-expanded=${hasChildren ? String(expanded) : nothing}
                tabindex=${node.key === focusKey ? 0 : -1}
                ?disabled=${Boolean(node.disabled)}
                @focus=${() => {
                  this.focusedKey = node.key;
                }}
                @click=${() => this.selectNode(node)}
                @keydown=${(event: KeyboardEvent) => this.onKeyDown(event, entry)}
              >
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
