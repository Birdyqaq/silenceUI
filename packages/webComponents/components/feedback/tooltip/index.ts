import { LitElement, css, html, type PropertyValues } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { baseControlStyles } from '../../_shared/styles';

let descriptionId = 0;

@customElement('su-tooltip')
export class SuTooltip extends LitElement {
  @property({ type: String }) content = '';
  @property({ type: String, reflect: true }) placement: 'top' | 'bottom' | 'left' | 'right' = 'top';
  @state() private open = false;
  private hovered = false;
  private focused = false;
  private focusTarget?: HTMLElement;
  private dismissed = false;
  private observer?: ResizeObserver;
  private leaveTimer?: ReturnType<typeof setTimeout>;
  private descriptions = new Map<HTMLElement, HTMLSpanElement>();
  private descriptionObserver?: MutationObserver;

  static styles = [
    baseControlStyles,
    css`
      :host {
        display: inline-block;
      }
      .bubble {
        position: fixed;
        inset: auto;
        margin: 0;
        border: 0;
        z-index: 1100;
        width: max-content;
        max-width: min(260px, calc(100vw - 16px));
        max-height: calc(100vh - 16px);
        overflow: auto;
        box-sizing: border-box;
        overflow-wrap: anywhere;
        background: var(--su-tooltip-bg, var(--su-text-1));
        color: var(--su-tooltip-color, var(--su-bg-card));
        font-size: var(--su-font-size-xs);
        line-height: 1.5;
        padding: 6px 10px;
        border-radius: var(--su-radius-sm);
        visibility: hidden;
        pointer-events: none;
      }
      .bubble.visible {
        visibility: visible;
        pointer-events: auto;
      }
    `,
  ];

  /** 监听组合树焦点，支持原生控件和开放影子树控件。 */
  connectedCallback() {
    super.connectedCallback();
    this.addEventListener('pointerenter', this.onEnter);
    this.addEventListener('pointerleave', this.onLeave);
    this.addEventListener('focusin', this.onFocusIn);
    this.addEventListener('focusout', this.onFocusOut);
    document.addEventListener('keydown', this.onKeyDown);
    this.descriptionObserver = new MutationObserver(this.syncDescriptions);
    if (this.hasUpdated) this.syncDescriptions();
  }

  /** 卸载时释放计时器、定位监听及本组件创建的描述。 */
  disconnectedCallback() {
    this.removeEventListener('pointerenter', this.onEnter);
    this.removeEventListener('pointerleave', this.onLeave);
    this.removeEventListener('focusin', this.onFocusIn);
    this.removeEventListener('focusout', this.onFocusOut);
    document.removeEventListener('keydown', this.onKeyDown);
    this.descriptionObserver?.disconnect();
    this.descriptionObserver = undefined;
    this.stopPositioning();
    clearTimeout(this.leaveTimer);
    this.clearDescriptions();
    this.hideBubblePopover();
    this.open = this.hovered = this.focused = this.dismissed = false;
    this.focusTarget = undefined;
    super.disconnectedCallback();
  }

  /** 内容与方向变化后同步描述、位置和顶层显示。 */
  protected willUpdate(changed: PropertyValues) {
    if (changed.has('content')) this.updateOpen();
  }

  protected updated(changed: PropertyValues) {
    if (!this.isConnected) return;
    if (changed.has('content')) {
      for (const description of this.descriptions.values()) description.textContent = this.content;
      if (!this.content.trim()) this.clearDescriptions();
      else this.syncDescriptions();
    }
    if (this.open) {
      const bubble = this.bubble;
      if (bubble?.showPopover && !bubble.matches(':popover-open')) bubble.showPopover();
      this.position();
      if (!this.observer && typeof ResizeObserver !== 'undefined') {
        this.observer = new ResizeObserver(this.position);
        this.observer.observe(this);
        if (bubble) this.observer.observe(bubble);
      }
      window.addEventListener('resize', this.position);
      window.addEventListener('scroll', this.position, true);
    } else {
      this.hideBubblePopover();
      this.stopPositioning();
    }
  }

  private get bubble() {
    return this.shadowRoot?.querySelector<HTMLElement>('.bubble');
  }

  /** Escape 后同一悬停/焦点会话保持关闭，离开后重新允许显示。 */
  private updateOpen() {
    if (!this.hovered && !this.focused) this.dismissed = false;
    this.open = Boolean(this.content.trim()) && (this.hovered || this.focused) && !this.dismissed;
  }
  private onEnter = () => {
    clearTimeout(this.leaveTimer);
    this.hovered = true;
    this.updateOpen();
  };
  private onLeave = () => {
    clearTimeout(this.leaveTimer);
    this.leaveTimer = setTimeout(() => {
      this.hovered = false;
      this.updateOpen();
    }, 150);
  };
  private onFocusIn = (event: FocusEvent) => {
    const target = event.composedPath()[0];
    if (target instanceof HTMLElement) {
      this.focusTarget = target;
      this.describe(target);
    }
    this.focused = true;
    this.updateOpen();
  };
  private onFocusOut = (event: FocusEvent) => {
    if (event.relatedTarget instanceof Node && this.contains(event.relatedTarget)) return;
    this.focused = false;
    this.focusTarget = undefined;
    this.updateOpen();
  };
  private onKeyDown = (event: KeyboardEvent) => {
    if (event.key !== 'Escape' || !this.open) return;
    this.dismissed = true;
    this.updateOpen();
  };

  /** 描述与触发元素放在同一 DOM 树，避免跨 ShadowRoot 的 ID 引用失效。 */
  private describe(target: HTMLElement) {
    if (!this.content.trim() || this.descriptions.has(target)) return;
    const root = target.getRootNode();
    if (!(root instanceof ShadowRoot) && !(root instanceof Document)) return;
    const description = document.createElement('span');
    description.id = 'su-tooltip-description-' + ++descriptionId;
    description.hidden = true;
    description.textContent = this.content;
    (root instanceof ShadowRoot ? root : root.body).appendChild(description);
    const ids = (target.getAttribute('aria-describedby') ?? '').split(/\s+/).filter(Boolean);
    target.setAttribute('aria-describedby', [...ids, description.id].join(' '));
    this.descriptions.set(target, description);
  }

  /** 增量维护动态触发器的描述，保留已有 ID，移除后释放失效关联。 */
  private syncDescriptions = () => {
    if (!this.isConnected) return;
    this.descriptionObserver?.disconnect();
    const targets = new Set<HTMLElement>();
    const roots = new Set<ShadowRoot>();
    const visit = (element: Element) => {
      if (
        element instanceof HTMLElement &&
        element.matches('button, input, select, textarea, a[href], [tabindex]')
      )
        targets.add(element);
      for (const child of element.children) visit(child);
      if (element.shadowRoot) {
        roots.add(element.shadowRoot);
        for (const child of element.shadowRoot.children) visit(child);
      }
    };
    for (const element of this.shadowRoot?.querySelector('slot')?.assignedElements() ?? [])
      visit(element);
    for (const [target, description] of this.descriptions) {
      if (!targets.has(target)) {
        this.removeDescription(target, description);
        this.descriptions.delete(target);
      }
    }
    for (const target of targets) this.describe(target);
    if (this.focusTarget && !targets.has(this.focusTarget)) {
      this.focusTarget = undefined;
      this.focused = false;
      this.updateOpen();
    }
    this.descriptionObserver?.observe(this, { childList: true, subtree: true });
    for (const root of roots)
      this.descriptionObserver?.observe(root, { childList: true, subtree: true });
  };

  private removeDescription(target: HTMLElement, description: HTMLSpanElement) {
    const remaining = (target.getAttribute('aria-describedby') ?? '')
      .split(/\s+/)
      .filter((id) => id && id !== description.id);
    if (remaining.length) target.setAttribute('aria-describedby', remaining.join(' '));
    else target.removeAttribute('aria-describedby');
    description.remove();
  }

  private clearDescriptions() {
    for (const [target, description] of this.descriptions) {
      this.removeDescription(target, description);
    }
    this.descriptions.clear();
  }

  /** 首选方向空间不足时翻转，并限制在视口内的八像素安全区。 */
  private position = () => {
    const bubble = this.bubble;
    if (!this.open || !bubble || !this.isConnected) return;
    const anchor = this.getBoundingClientRect();
    const rect = bubble.getBoundingClientRect();
    const width = document.documentElement.clientWidth || window.innerWidth;
    const height = document.documentElement.clientHeight || window.innerHeight;
    const gap = 8;
    const spaces = {
      top: anchor.top,
      bottom: height - anchor.bottom,
      left: anchor.left,
      right: width - anchor.right,
    };
    const opposite = { top: 'bottom', bottom: 'top', left: 'right', right: 'left' } as const;
    let side = Object.hasOwn(spaces, this.placement) ? this.placement : 'top';
    const size = side === 'top' || side === 'bottom' ? rect.height : rect.width;
    if (spaces[side] < size + gap * 2 && spaces[opposite[side]] > spaces[side])
      side = opposite[side];
    let x = anchor.left + (anchor.width - rect.width) / 2;
    let y = anchor.top + (anchor.height - rect.height) / 2;
    if (side === 'top') y = anchor.top - rect.height - gap;
    if (side === 'bottom') y = anchor.bottom + gap;
    if (side === 'left') x = anchor.left - rect.width - gap;
    if (side === 'right') x = anchor.right + gap;
    bubble.style.left = Math.max(gap, Math.min(x, width - rect.width - gap)) + 'px';
    bubble.style.top = Math.max(gap, Math.min(y, height - rect.height - gap)) + 'px';
    bubble.dataset.placement = side;
  };

  private hideBubblePopover() {
    const bubble = this.bubble;
    if (bubble?.hidePopover && bubble.matches(':popover-open')) bubble.hidePopover();
  }
  private stopPositioning() {
    window.removeEventListener('resize', this.position);
    window.removeEventListener('scroll', this.position, true);
    this.observer?.disconnect();
    this.observer = undefined;
  }

  render() {
    // 保留纯文本的首尾空白语义，不让格式化为内容额外插入换行。
    // prettier-ignore
    return html`<slot @slotchange=${this.syncDescriptions}></slot>
      <div
        class="bubble ${this.open ? 'visible' : ''}"
        role="tooltip"
        popover="manual"
        aria-hidden=${this.open ? 'false' : 'true'}
        @pointerenter=${this.onEnter}
        @pointerleave=${this.onLeave}
      >${this.content}</div>`;
  }
}
